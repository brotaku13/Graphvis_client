import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

import Graph from './graph';
import { getColorPair, hslaString } from '../../utils/Colors';

import { getGraph } from '../../utils/GraphvisAPI';

const DefaultNodeColors = getColorPair(268, 67, 32, 1, 0.4);
const DefaultEdgeColors = getColorPair(277, 0, 0, 1, 0.2);

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
    edges: undefined,
    colorScheme: 'default',
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

const highlightNeighbors = (graphData, id) => {
  let newNodeColorArr = DefaultColorState(
    graphData.nodes.length,
    DefaultNodeColors.selected,
  );
  let newEdgeColorArr = DefaultColorState(
    graphData.edges.length,
    DefaultEdgeColors.selected,
  );

  let cy = graphData.cy;
  let colorScheme = graphData.colorScheme;

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
        newNodeColorArr[data.id] = data.color[colorScheme].unselected;
      } else {
        newEdgeColorArr[data.colorIndex] = data.color[colorScheme].unselected;
      }
    }

    //highlight neighbors
    for (let n = 0; n < neighbors.length; ++n) {
      let elem = neighbors[n];
      let data = elem.data();
      data.selected = true;
      if (elem.isNode()) {
        newNodeColorArr[data.id] = data.color[colorScheme].selected;
      } else {
        newEdgeColorArr[data.colorIndex] = data.color[colorScheme].selected;
      }
    }
  }

  console.log(newEdgeColorArr);
  console.log(newNodeColorArr);
  return [newNodeColorArr, newEdgeColorArr];
};

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

  const selectedNode = useRef(null);

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

  const deselectAll = () => {
    setOcdNodeColors(
      DefaultColorState(ocdGraph.nodes.length, DefaultNodeColors.selected),
    );
    setOcdEdgeColors(
      DefaultColorState(ocdGraph.edges.length, DefaultEdgeColors.selected),
    );

    setConNodeColors(
      DefaultColorState(conGraph.nodes.length, DefaultNodeColors.selected),
    );
    setConEdgeColors(
      DefaultColorState(conGraph.edges.length, DefaultEdgeColors.selected),
    );
  };

  const onNodeClick = node => {
    let id = node.id;
    deselectAll();
    console.log('ocd here');
    if (selectedNode.current !== id) {
      // (async () => {
      // })();

      let [ocdNodeColors, ocdEdgeColors] = highlightNeighbors(ocdGraph, id);
      setOcdNodeColors(ocdNodeColors);
      setOcdEdgeColors(ocdEdgeColors);
      // (async () => {

      // })();
      console.log('con here');
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
    prevProps.colorBy === nextProps.colorBy
  );
});
