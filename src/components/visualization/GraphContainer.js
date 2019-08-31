import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

import Graph from './graph';
import { getColorPair, DefaultEdgeColors, DefaultNodeColors, getColorByValue, COLOR_BY } from '../../utils/Colors';

import { getGraph } from '../../utils/GraphvisAPI';


const DefaultColorState = (len, color) => {
  return Array(len).fill(color);
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
};

const GraphData = () => {
  return {
    cy: undefined,
    nodes: undefined,
    edges: undefined
  };
};

const Node = (id, abbrevName, fullName, x, y, z, orbits) => {
  return {
    id: id,
    abbrevName: abbrevName,
    fullName: fullName,
    fx: x,
    fy: y,
    fz: z,
    orbits: orbits,
    selected: true,
    color: {
      default: DefaultNodeColors,
    },
  };
};

const Edge = (id, from, to, weight, idx) => {
  return {
    id: id,
    source: from,
    target: to,
    weight: weight,
    colorIndex: idx,
    color: {
      default: DefaultEdgeColors,
    },
    selected: true,
  };
};

function moveCamera(position, graph, lookat) {
  graph.cameraPosition(
    {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    lookat,
  );
}

const buildGraphComponents = nodes => {
  const graphData = GraphData();
  let cyElements = [];
  let forceGraphNodes = [];
  let forceGraphEdges = [];

  let edgeTracker = {}; // tracks from -> to
  let edgeColorIndex = 0;
  for (let i = 0; i < nodes.length; ++i) {
    let n = nodes[i];
    let newNode = Node(
      n.id,
      n.abbrevName,
      n.fullName,
      ...Object.values(n.coordinates),
      n.orbits,
    );
    forceGraphNodes.push(newNode);
    cyElements.push({ data: newNode });
    let edges = n.edges;
    for (let j = 0; j < edges.length; ++j) {
      let e = edges[j];

      if (e.to in edgeTracker && edgeTracker[e.to].contains(n.id)) {
        //already made this edge
        console.log(e);
      } else {
        let newEdge = Edge(e._id, n.id, e.to, e.weight, edgeColorIndex++);
        forceGraphEdges.push(newEdge);
        cyElements.push({ data: newEdge });

        if (n.id in edgeTracker) {
          edgeTracker[n.id].add(e.to);
        } else {
          edgeTracker[n.id] = new Set([e.to]);
        }
      }
    }
  }
  graphData.cy = cytoscape({ elements: cyElements });
  graphData.nodes = forceGraphNodes;
  graphData.edges = forceGraphEdges;

  //create the objects that will hold the colors for each node
  let nodeColors = DefaultColorState(
    forceGraphNodes.length,
    DefaultNodeColors.selected,
  );
  let edgeColors = DefaultColorState(
    forceGraphEdges.length,
    DefaultEdgeColors.selected,
  );

  return [graphData, nodeColors, edgeColors];
};

const GraphContainer = props => {
  const [isLoading, setIsLoading] = useState(true);

  const [ocdGraph, setOcdGraph] = useState(GraphData());
  const [conGraph, setConGraph] = useState(GraphData());

  const [conNodeColors, setConNodeColors] = useState([]);
  const [conEdgeColors, setConEdgeColors] = useState([]);

  const [ocdNodeColors, setOcdNodeColors] = useState([]);
  const [ocdEdgeColors, setOcdEdgeColors] = useState([]);

  const [colorSchemes, setColorSchemes] = useState(new Set([COLOR_BY.DEFAULT]))

  const selectedNode = useRef(null);
  const nodeColorScheme = useRef(COLOR_BY.DEFAULT);
  const edgeColorScheme = useRef('default');

  var ocdGraphRef = null;
  var conGraphRef = null;

  const setCamera = (ref, name) => {
    if (name === 'ocd') {
      ocdGraphRef = ref;
    } else {
      conGraphRef = ref;
    }

    if (conGraphRef && ocdGraphRef) {
      ocdGraphRef.camera().up = conGraphRef.camera().up;
      ocdGraphRef.camera().matrix = conGraphRef.camera().matrix;

      // linkCameras(conGraphRef, ocdGraphRef);
      conGraphRef.controls().addEventListener('change', event => {
        moveCamera(
          event.target.object.position,
          ocdGraphRef,
          conGraphRef.cameraPosition().lookat,
        );
      });

      ocdGraphRef.controls().addEventListener('change', event => {
        moveCamera(
          event.target.object.position,
          conGraphRef,
          ocdGraphRef.cameraPosition().lookat,
        );
      });
    }
  };

  const highlightNeighbors = (graphData, id) => {
    let newNodeColorArr = [];
    let newEdgeColorArr = [];
  
    let cy = graphData.cy;
  
    let elems = cy.nodes(`#${id}`);
    if (elems.length !== 0) {
      // debugger;
      let neighbors = elems.closedNeighborhood();
      let notNeighbors = cy.elements().difference(neighbors);
  
      //un-highlight not-neighbors
      for (let n = 0; n < notNeighbors.length; ++n) {
        let elem = notNeighbors[n];
        let data = elem.data();
        data.selected = false;
  
        if (elem.isNode()) {
          newNodeColorArr[data.id] = data.color[nodeColorScheme.current].unselected;
        } else {
          newEdgeColorArr[data.colorIndex] = data.color[edgeColorScheme.current].unselected;
        }
      }
  
      //highlight neighbors
      for (let n = 0; n < neighbors.length; ++n) {
        let elem = neighbors[n];
        let data = elem.data();
        data.selected = true;
        if (elem.isNode()) {
          newNodeColorArr[data.id] = data.color[nodeColorScheme.current].selected;
        } else {
          newEdgeColorArr[data.colorIndex] = data.color[edgeColorScheme.current].selected;
        }
      }
    }
  
    return [newNodeColorArr, newEdgeColorArr];
  };

  //needs to be reworked to color set each nodes color to the 'selected' color for the applied colorScheme
  const deselect = (graph, nodeCB, edgeCB) => {

    let newNodeColors = Array(graph.nodes.length);
    let newEdgeColors = Array(graph.edges.length);

    graph.nodes.forEach(node => {
      newNodeColors[node.id] = node.color[nodeColorScheme.current].selected;
    })

    graph.edges.forEach(edge => {
      newEdgeColors[edge.colorIndex] = edge.color[edgeColorScheme.current].selected;
    })

    nodeCB(newNodeColors);
    edgeCB(newEdgeColors);    

  };

  const deselectAll = () => {
    deselect(ocdGraph, setOcdNodeColors, setOcdEdgeColors);
    deselect(conGraph, setConNodeColors, setConEdgeColors);
  }

  const onNodeClick = node => {
    let id = node.id;
    deselectAll();

    if (selectedNode.current !== id) {
      let [ocdNodeColors, ocdEdgeColors] = highlightNeighbors(ocdGraph, id);
      setOcdNodeColors(ocdNodeColors);
      setOcdEdgeColors(ocdEdgeColors);

      let [conNodeColors, conEdgeColors] = highlightNeighbors(conGraph, id);
      setConNodeColors(conNodeColors);
      setConEdgeColors(conEdgeColors);

      selectedNode.current = id;
    } else {
      selectedNode.current = null;
    }
  };

  useEffect(() => {
    getGraph(props.graphId)
      .then(res => {
        if (res.status !== 200) {
          //set errors
        }

        let [conGraphData, conNodeColors, conEdgeColors] = buildGraphComponents(
          res.data.graphs.con.nodes,
        );
        setConGraph(conGraphData);
        setConNodeColors(conNodeColors);
        setConEdgeColors(conEdgeColors);

        let [ocdGrapData, ocdNodeColors, ocdEdgeColors] = buildGraphComponents(
          res.data.graphs.ocd.nodes,
        );
        setOcdGraph(ocdGrapData);
        setOcdNodeColors(ocdNodeColors);
        setOcdEdgeColors(ocdEdgeColors);

        setIsLoading(false);
      })
      .catch(exception => {
        setConGraph(buildGraphComponents([]));
        setOcdGraph(buildGraphComponents([]));
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getGraph(props.graphId)
      .then(res => {
        if (res.status !== 200) {
          //set errors
        }

        let [conGraphData, conNodeColors, conEdgeColors] = buildGraphComponents(
          res.data.graphs.con.nodes,
        );
        setConGraph(conGraphData);
        setConNodeColors(conNodeColors);
        setConEdgeColors(conEdgeColors);

        let [ocdGrapData, ocdNodeColors, ocdEdgeColors] = buildGraphComponents(
          res.data.graphs.ocd.nodes,
        );
        setOcdGraph(ocdGrapData);
        setOcdNodeColors(ocdNodeColors);
        setOcdEdgeColors(ocdEdgeColors);

        setIsLoading(false);
      })
      .catch(exception => {
        setConGraph(buildGraphComponents([]));
        setOcdGraph(buildGraphComponents([]));
        setIsLoading(false);
      });
  }, [props.graphId]);

  useEffect(() => {
    let scheme = props.colorBy;
    if(scheme === COLOR_BY.ORBIT_FREQUENCY){
      scheme = `orbit_${props.orbitId}`
    }
    if(scheme === nodeColorScheme.current){
      return;
    }
    //we need to treat orbits special since their are so many of them. Caching their colors for each node would be a resource drain
    nodeColorScheme.current = scheme;
    if(colorSchemes.has(scheme)){
      //already calculated this, apply colors
      applyColorScheme();

    } else {
      //Calculate the colors
      if(scheme.startsWith('orbit')){
        colorByOrbit(props.orbitFrequency);
      } else {
        switch(scheme){
          case COLOR_BY.DEGREE:
            colorByDegree();
            break;
          //other switches here
        }
      }
      colorSchemes.add(scheme);
      applyColorScheme()
    }
  }, [props.colorBy])

  const applyColorScheme = () => {
    //this function constructs new arrays and sets them for each graph type based on the current color scheme
    let ocdColors = Array(ocdGraph.nodes.length);
    ocdGraph.nodes.forEach(n => {
      ocdColors[n.id] = n.selected ? n.color[nodeColorScheme.current].selected : n.color[nodeColorScheme.current].unselected
    })
    setOcdNodeColors(ocdColors);

    let conColors = Array(conGraph.nodes.length);
    conGraph.nodes.forEach(n => {
      conColors[n.id] = n.selected ? n.color[nodeColorScheme.current].selected : n.color[nodeColorScheme.current].unselected
    })
    setConNodeColors(conColors);
  }

  const colorByOrbit = (orbitId) => {
    if(orbitId === undefined){
      orbitId = 0;
    }
    let scheme = `orbit_${orbitId}`;
    let allNodes = [...ocdGraph.nodes, ...conGraph.nodes];
    let min = Math.min.apply(Math, allNodes.map(n => n.orbits[orbitId].frequency));
    let max = Math.max.apply(Math, allNodes.map(n => n.orbits[orbitId].frequency));

    [conGraph, ocdGraph].forEach(g => {
      g.nodes.forEach(n => {
        n.color[scheme] = getColorByValue(n.orbits[orbitId].frequency, min, max);
      })
    })
    return [min, max];
  }

  const colorByDegree = () => {
    let scheme = COLOR_BY.DEGREE;
    let ocdNodes = ocdGraph.cy.nodes()
    let conNodes = conGraph.cy.nodes()
    let min = Math.min(ocdNodes.minDegree(), conNodes.minDegree())
  
    // fucking hack because for some reason
    // let max = Math.max(ocdNodes.maxDegree(), conNodes.maxDegree())
    // WOULD NOT WORK LIKE WHAT THE ACTUAL FUCK JS
    let max1 = ocdNodes.maxDegree();
    let max2 = conNodes.maxDegree();
    let max = Math.max(max1, max2);

    [conGraph, ocdGraph].forEach(g => {
      g.cy.nodes().forEach(n => {
        n.data().color[scheme] = getColorByValue(n.degree(), min, max);
      })
    })
    
    return [min, max];
  }

  if (
    isLoading &&
    ocdGraph.edges === undefined &&
    ocdGraph.nodes === undefined
  ) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={styles.root}>
        <Graph
          name="ocd"
          nodes={ocdGraph.nodes}
          edges={ocdGraph.edges}
          setCamera={setCamera}
          onNodeClick={onNodeClick}
          nodeColors={ocdNodeColors}
          edgeColors={ocdEdgeColors}
        />
        <Graph
          name="con"
          nodes={conGraph.nodes}
          edges={conGraph.edges}
          setCamera={setCamera}
          onNodeClick={onNodeClick}
          nodeColors={conNodeColors}
          edgeColors={conEdgeColors}
        />
      </div>
    );
  }
};

export default React.memo(GraphContainer, (prevProps, nextProps) => {
  console.log(prevProps, nextProps);
  return (
    prevProps.graphId === nextProps.graphId &&
    prevProps[0] === nextProps[0] &&
    prevProps[1] === nextProps[1] &&
    prevProps.colorBy === nextProps.colorBy &&
    prevProps.orbitFrequency === nextProps.orbitFrequency
  );
});
