import React, { useState, useEffect } from 'react';
import ForceGraph3d from 'react-force-graph-3d';

import useWindowDimensions from './useWindowDimensions';

//use this for displaying data only.
//any graph data manipulation should be done in the container class
const nodeSize = 0.15;
const nodeResolution = 30;

const Graph = props => {
  console.log(props);
  const { width } = useWindowDimensions();

  const getNodeLabel = node => {
    return node.id;
  };
  const getNodeColor = node => {
    return 'blue';
  };
  const onNodeClick = node => {};
  const getEdgeColor = edge => {
    return 'black';
  };
  const getEdgeWidth = edge => {
    return 0;
  };

  useEffect(() => {
    //component did mount
    props.setCamera(ref, props.name);
  }, []);

  return (
    <ForceGraph3d
      ref={el => {
        ref = el;
      }}
      graphData={{ nodes: props.nodes, links: props.edges }}
      backgroundColor="White"
      nodeVal={nodeSize}
      nodeLabel={node => getNodeLabel(node)}
      nodeColor={node => getNodeColor(node)}
      nodeResolution={nodeResolution}
      enableNodeDrag={false}
      onNodeClick={node => onNodeClick(node)}
      linkColor={edge => getEdgeColor(edge)}
      linkWidth={edge => getEdgeWidth(edge)}
      width={width / 2}
    />
  );
};

export default Graph;
