import React, { useState, useEffect } from 'react';
import cytoscape from 'cytoscape';

import Graph from './graph';

import { getGraph } from '../../utils/GraphvisAPI';

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
    selected: false,
    color: {},
  };
};

const Edge = (id, from, to, weight) => {
  return {
    id: id,
    source: from,
    target: to,
    weight: weight,
    color: {},
    selected: false,
  };
};

const buildGraphComponents = (nodes, graphData) => {
  let cyElements = [];
  let forceGraphNodes = [];
  let forceGraphEdges = [];

  let edgeTracker = {}; // tracks from -> to

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
        let newEdge = Edge(e._id, n.id, e.to, e.weight);
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
};

const moveCamera = (pos, graph, lookat) => {
  graph.cameraPosition(
    {
      x: pos.x,
      y: pos.y,
      x: pos.z,
    },
    lookat,
  );
};

const linkCameras = (ocd, con) => {
  let ocdCam = ocd.camera();
  let conCam = ocd.camera();
  console.log(ocdCam);
  debugger;
  ocdCam.matrix = conCam.matrix;
  ocdCam.rotation = conCam.rotation;
  ocdCam.quaternions = conCam.quaternions;
  ocdCam.up = conCam.up;

  ocd.addEventListener('change', e => {
    moveCamera(e.target.object.position, ocd, con.cameraPosition().lookat);
  });

  con.addEventListener('change', e => {
    moveCamera(e.target.object.position, con, ocd.cameraPosition().lookat);
  });
};

const GraphContainer = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ocdGraph, setOcdGraph] = useState(GraphData());
  const [conGraph, setConGraph] = useState(GraphData());

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

  useEffect(() => {
    getGraph(props.graphId).then(res => {
      if (res.status !== 200) {
        //set errors
      }
      // setGraphData(res.data);
      buildGraphComponents(res.data.graphs.con.nodes, conGraph);
      buildGraphComponents(res.data.graphs.ocd.nodes, ocdGraph);
      setIsLoading(false);
    });
  }, []);

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
        />
        <Graph
          name="con"
          nodes={conGraph.nodes}
          edges={conGraph.edges}
          setCamera={setCamera}
        />
      </div>
    );
  }
};

export default GraphContainer;
