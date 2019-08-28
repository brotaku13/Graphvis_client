import React, { useState, useEffect } from "react";
import cytoscape from 'cytoscape'

import Graph from "./graph";

import { getGraph } from "../../utils/GraphvisAPI";

const styles = {
  root: {
    display: "flex",
    flexDirection: "row"
  }
};

const GraphData = () =>{
  return {
    cy: undefined,
    nodes: undefined, 
    edges: undefined
  }
}

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
    color: {}
  }
}

const Edge = (id, from, to, weight) => {
  return {
    id: id,
    source: from, 
    target: to, 
    weight: weight,
    color: {},
    selected: false
  }
}

const buildGraphComponents = (nodes, graphData) =>{
    let cyElements = []
    let forceGraphNodes = []
    let forceGraphEdges = []

    for(let i = 0; i < nodes.length; ++i){
      let n = nodes[i];
      let newNode = Node(n.id, n.abbrevName, n.fullName, ...Object.values(n.coordinates), n.orbits);
      forceGraphNodes.push(newNode);
      cyElements.push({data: newNode})
      let edges = n.edges
      for(let j = 0; j < edges.length; ++j){
        let e = edges[j];
        let newEdge = Edge(e._id, n.id, e.to, e.weight);
        forceGraphEdges.push(newEdge);
        cyElements.push({data: newEdge});
      }
    }
    graphData.cy = cytoscape({elements: cyElements});
    graphData.nodes = forceGraphNodes;
    graphData.edges = forceGraphEdges
}


const GraphContainer = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ocdGraph, setOcdGraph] = useState(GraphData())
  const [conGraph, setConGraph] = useState(GraphData())
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    getGraph(props.graphId).then(res => {
      if (res.status !== 200) {
        //set errors
      }
      // setGraphData(res.data);
      console.log(res.data);
      buildGraphComponents(res.data.graphs.con.nodes, conGraph);
      buildGraphComponents(res.data.graphs.ocd.nodes, ocdGraph);
      console.log('oops I did it again')
      setIsLoading(false);
    });
  }, []);

  const refCallbak = e => {
    if(e){
      let n = e.getBoundingClientRect()
      console.log(n)
      setWindowWidth(n.width)
    }
  }

  if (isLoading && ocdGraph.edges === undefined && ocdGraph.nodes === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={styles.root} >
        <Graph name="ocd" nodes={ocdGraph.nodes} edges={ocdGraph.edges} width={windowWidth}/>
        <Graph name="ocd" nodes={conGraph.nodes} edges={conGraph.edges} width={props.windowWidth}/>
      </div>
    );
  }
};

export default GraphContainer;
