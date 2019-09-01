import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { round } from '../../utils/Math';

import Graph from './graph';
import {
  DefaultEdgeColors,
  DefaultNodeColors,
  getColorByValue,
  COLOR_BY,
} from '../../utils/Colors';

import { getGraph } from '../../utils/GraphvisAPI';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { SizeMe } from 'react-sizeme';
import { makeStyles } from '@material-ui/core/styles';

const DefaultColorState = (len, color) => {
  return Array(len).fill(color);
};

const styles = {
  root: {},

  graphText: {
    position: 'absolute',
    bottom: '2em',
    left: '50%',
    transform: 'translateX(-45%)',
    display: 'inline-block',
  },
};

const useStyles = makeStyles(theme => ({
  gridRow: {
    position: 'relative',
    backgroundColor: 'black',
  },
}));

const GraphData = () => {
  return {
    cy: undefined,
    nodes: undefined,
    edges: undefined,
  };
};

const Node = (id, abbrevName, fullName, x, y, z, orbits) => {
  let temp = {};
  Object.values(orbits).forEach(o => (temp[`orbit_${o.id}`] = o.frequency));
  return {
    id: id,
    abbrevName: abbrevName,
    fullName: fullName,
    fx: x,
    fy: y,
    fz: z,
    selected: true,
    color: {
      default: DefaultNodeColors,
    },
    metrics: {
      //place to store things like degree, betweenness centrality, orbit, etc
      ...temp,
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
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);

  const [ocdGraph, setOcdGraph] = useState(GraphData());
  const [conGraph, setConGraph] = useState(GraphData());

  const [conNodeColors, setConNodeColors] = useState([]);
  const [conEdgeColors, setConEdgeColors] = useState([]);

  const [ocdNodeColors, setOcdNodeColors] = useState([]);
  const [ocdEdgeColors, setOcdEdgeColors] = useState([]);

  const colorSchemes = useRef({
    [COLOR_BY.DEFAULT.value]: [],
  });
  const selectedNode = useRef(null);
  const nodeColorScheme = useRef(COLOR_BY.DEFAULT.value);
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
          newNodeColorArr[data.id] =
            data.color[nodeColorScheme.current].unselected;
        } else {
          newEdgeColorArr[data.colorIndex] =
            data.color[edgeColorScheme.current].unselected;
        }
      }

      //highlight neighbors
      for (let n = 0; n < neighbors.length; ++n) {
        let elem = neighbors[n];
        let data = elem.data();
        data.selected = true;
        if (elem.isNode()) {
          newNodeColorArr[data.id] =
            data.color[nodeColorScheme.current].selected;
        } else {
          newEdgeColorArr[data.colorIndex] =
            data.color[edgeColorScheme.current].selected;
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
      node.selected = true;
    });

    graph.edges.forEach(edge => {
      newEdgeColors[edge.colorIndex] =
        edge.color[edgeColorScheme.current].selected;
      edge.selected = true;
    });

    nodeCB(newNodeColors);
    edgeCB(newEdgeColors);
  };

  const deselectAll = () => {
    deselect(ocdGraph, setOcdNodeColors, setOcdEdgeColors);
    deselect(conGraph, setConNodeColors, setConEdgeColors);
  };

  const onNodeClick = node => {
    let id = node.id;
    deselectAll();

    if (selectedNode.current !== id) {
      let [ocdNodeColors, ocdEdgeColors] = highlightNeighbors(ocdGraph, id);
      let [conNodeColors, conEdgeColors] = highlightNeighbors(conGraph, id);

      setOcdNodeColors(ocdNodeColors);
      setOcdEdgeColors(ocdEdgeColors);
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

        let [ocdGraphData, ocdNodeColors, ocdEdgeColors] = buildGraphComponents(
          res.data.graphs.ocd.nodes,
        );
        setOcdGraph(ocdGraphData);
        setOcdNodeColors(ocdNodeColors);
        setOcdEdgeColors(ocdEdgeColors);

        props.setGraphTitle((res.data && res.data.name) || '');
        props.setGraphAuthor((res.data && res.data.author) || '');

        props.setEdgeWeightRange(ocdGraphData.edges, conGraphData.edges);

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
    if (scheme === COLOR_BY.ORBIT_FREQUENCY.value) {
      scheme = `orbit_${props.orbitId}`;
    }
    if (scheme === nodeColorScheme.current) {
      return;
    }

    //first set the new current color scheme
    nodeColorScheme.current = scheme;
    if (scheme in colorSchemes.current) {
      //already calculated this, apply colorScheme
      applyColorScheme();
    } else {
      //Calculate the colors
      let extrema;
      if (scheme.startsWith('orbit')) {
        extrema = colorByOrbit(props.orbitId);
      } else {
        switch (scheme) {
          case COLOR_BY.DEGREE.value:
            extrema = colorByDegree();
            break;
          //other switches here
          case COLOR_BY.STRENGTH.value:
            extrema = colorByStrength();
            break;
          case COLOR_BY.DEGREE_CENTRALITY.value:
            extrema = colorByDegreeCentrality();
            break;
          case COLOR_BY.BETWEEN_CENTRALITY.value:
            extrema = colorByBetweennessCentrality();
            break;
        }
      }
      colorSchemes.current[scheme] = extrema;
      applyColorScheme();
    }
  }, [props]);

  const applyColorScheme = () => {
    //this function constructs new arrays and sets them for each graph type based on the current color scheme
    props.setColorScaleExtrema(colorSchemes.current[nodeColorScheme.current]);

    let ocdColors = Array(ocdGraph.nodes.length);
    ocdGraph.nodes.forEach(n => {
      ocdColors[n.id] = n.selected
        ? n.color[nodeColorScheme.current].selected
        : n.color[nodeColorScheme.current].unselected;
      if (!n.selected) {
        console.log(n);
      }
    });

    let conColors = Array(conGraph.nodes.length);
    conGraph.nodes.forEach(n => {
      conColors[n.id] = n.selected
        ? n.color[nodeColorScheme.current].selected
        : n.color[nodeColorScheme.current].unselected;
      if (!n.selected) {
        console.log(n);
      }
    });

    setOcdNodeColors(ocdColors);
    setConNodeColors(conColors);
  };

  const colorByOrbit = orbitId => {
    if (orbitId === undefined) {
      orbitId = 0;
    }
    let scheme = `orbit_${orbitId}`;
    let allNodes = [...ocdGraph.nodes, ...conGraph.nodes];
    let min = Math.min.apply(Math, allNodes.map(n => n.metrics[scheme]));
    let max = Math.max.apply(Math, allNodes.map(n => n.metrics[scheme]));

    [conGraph, ocdGraph].forEach(g => {
      g.nodes.forEach(n => {
        n.color[scheme] = getColorByValue(n.metrics[scheme], min, max);
      });
    });
    return [min, max];
  };

  const colorByStrength = () => {
    let scheme = COLOR_BY.STRENGTH.value;
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let graphs = new Array(conGraph, ocdGraph);
    let strength;
    let adjacent;
    graphs.forEach(g => {
      g.cy.nodes().forEach(n => {
        adjacent = n.neighborhood();
        strength = round(
          adjacent.reduce((acc, el) => {
            if (el.isEdge() && el.data().weight !== undefined) {
              return acc + el.data().weight;
            }
            return acc;
          }, 0),
          2,
        );
        n.data().metrics[scheme] = strength;
        if (strength > max) {
          max = strength;
        } else if (strength < min) {
          min = strength;
        }
      });
    });

    //apply colors
    graphs.forEach(g => {
      g.nodes.forEach(n => {
        n.color[scheme] = getColorByValue(n.metrics[scheme], min, max);
      });
    });

    return [min, max];
  };

  const colorByDegreeCentrality = () => {
    let scheme = COLOR_BY.DEGREE_CENTRALITY.value;
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let graphs = new Array(conGraph, ocdGraph);
    graphs.forEach(g => {
      let dc = g.cy.$().degreeCentralityNormalized();
      g.cy.nodes().forEach(n => {
        // centralityConfig.root = n;
        let degreeCen = round(dc.degree(n), 3);
        n.data().metrics[scheme] = degreeCen;
        if (degreeCen > max) {
          max = degreeCen;
        } else if (degreeCen < min) {
          min = degreeCen;
        }
      });
    });

    graphs.forEach(g => {
      g.nodes.forEach(n => {
        n.color[scheme] = getColorByValue(n.metrics[scheme], min, max);
      });
    });
    return [min, max];
  };

  const colorByDegree = () => {
    let scheme = COLOR_BY.DEGREE.value;

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let degree = null;
    let graphs = new Array(conGraph, ocdGraph);

    graphs.forEach(g => {
      g.cy.nodes().forEach(n => {
        degree = n.degree();
        if (degree > max) {
          max = degree;
        } else if (degree < min) {
          min = degree;
        }
        n.data().metrics.degree = degree;
      });
    });

    graphs.forEach(g => {
      g.cy.nodes().forEach(n => {
        n.data().color[scheme] = getColorByValue(n.degree(), min, max);
      });
    });

    return [min, max];
  };

  const colorByBetweennessCentrality = () => {
    let scheme = COLOR_BY.BETWEEN_CENTRALITY.value;
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let graphs = new Array(conGraph, ocdGraph);
    graphs.forEach(g => {
      let bc = g.cy.$().betweennessCentrality();
      g.cy.nodes().forEach(n => {
        let val = round(bc.betweenness(n), 2);
        n.data().metrics[scheme] = val;
        if (val > max) {
          max = val;
        } else if (val < min) {
          min = val;
        }
      });
    });

    graphs.forEach(g => {
      g.nodes.forEach(n => {
        n.color[scheme] = getColorByValue(n.metrics[scheme], min, max);
      });
    });

    return [min, max];
  };

  if (
    isLoading ||
    ocdGraph.edges === undefined ||
    ocdGraph.nodes === undefined ||
    conGraph.nodes === undefined ||
    conGraph.edges === undefined
  ) {
    return <div>Loading...</div>;
  } else {
    return (
      <Grid container>
        <Grid item xs={12} md={6} className={classes.gridRow}>
          <SizeMe refreshRate={16} noPlaceholder>
            {({ size }) => (
              <Graph
                name="ocd"
                nodes={ocdGraph.nodes}
                edges={ocdGraph.edges}
                setCamera={setCamera}
                onNodeClick={onNodeClick}
                nodeColors={ocdNodeColors}
                edgeColors={ocdEdgeColors}
                size={size}
                shouldSetEdgeVisibility={props.shouldSetEdgeVisibility}
                edgeWeightRange={props.edgeWeightRange}
                currentMetric={nodeColorScheme.current}
              />
            )}
          </SizeMe>
          <div style={styles.graphText}>
            <Typography variant="h6">OCD Graph</Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridRow}>
          <SizeMe refreshRate={16} noPlaceholder>
            {({ size }) => (
              <Graph
                name="con"
                nodes={conGraph.nodes}
                edges={conGraph.edges}
                setCamera={setCamera}
                onNodeClick={onNodeClick}
                nodeColors={conNodeColors}
                edgeColors={conEdgeColors}
                size={size}
                shouldSetEdgeVisibility={props.shouldSetEdgeVisibility}
                edgeWeightRange={props.edgeWeightRange}
                currentMetric={nodeColorScheme.current}
              />
            )}
          </SizeMe>
          <div style={styles.graphText}>
            <Typography variant="h6">Control Graph</Typography>
          </div>
        </Grid>
      </Grid>
    );
  }
};
// return true if we DON"T want to rerender
export default React.memo(GraphContainer, (prevProps, nextProps) => {
  return (
    prevProps.graphId === nextProps.graphId &&
    prevProps.edgeWeightRange[0] === nextProps.edgeWeightRange[0] &&
    prevProps.edgeWeightRange[1] === nextProps.edgeWeightRange[1] &&
    ((prevProps.colorBy !== 'orbit_frequency' &&
      nextProps.colorBy === 'orbit_frequency') ||
      prevProps.colorBy === nextProps.colorBy) &&
    prevProps.orbitId === nextProps.orbitId &&
    prevProps.selectedOrbitIdBefore === nextProps.selectedOrbitIdBefore
  );
});
