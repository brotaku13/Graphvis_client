import React, { useState, useEffect } from 'react';
import ForceGraph3d from 'react-force-graph-3d';
import axios from 'axios';

const makeRandomTree = (n = 300) => ({
  nodes: [...Array(n).keys()].map(i => ({ id: i })),
  links: [...Array(n).keys()]
    .filter(id => id)
    .map(id => ({ source: id, target: Math.round(Math.random() * (id - 1)) })),
});

const Graph = id => {
  const [graphData, setGraphData] = useState({
    cytoscape: {},
    forceGraph: {},
  });
  console.log(graphData, setGraphData); // to silence errors for now

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('https://httpbin.org/get');
        console.log(response.data);
      } catch (exception) {
        console.error(exception);
      }
    })();
  });

  return <ForceGraph3d graphData={makeRandomTree()} />;
};

export default Graph;
