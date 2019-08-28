import React, {useState} from 'react'
import ForceGraph3d from 'react-force-graph-3d'


//use this for displaying data only. 
//any graph data manipulation should be done in the container class
const nodeSize = 0.15;
const nodeResolution = 30;

const Graph = () => {

  const getNodeLabel = node => {
    return node.id;
  }
  const getNodeColor = node => {
    return 'blue'
  }
  const onNodeClick = node => {

  }
  const getEdgeColor = edge => {
    return 'black'
  }
  const getEdgeWidth = edge => {
    return 0
  }

  return (
    <ForceGraph3d 
      graphData={{nodes: props.nodes, links: props.edges}}
      backgroundColor='white'
      nodeVal={nodeSize}
      nodeLabel={node => getNodeLabel(node)}
      nodeColor={node => getNodeColor(node)}
      nodeResolution={nodeResolution}
      enableNodeDrag={false}
      onNodeClick={node => onNodeClick(node)}
      linkColor={edge => getEdgeColor(edge)}
      linkWidth={edge => getEdgeWidth(edge)}
    />
  )
}

export default Graph
