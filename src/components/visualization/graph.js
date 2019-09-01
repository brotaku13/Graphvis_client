import React, { useEffect, useState } from 'react';
import ForceGraph3d from 'react-force-graph-3d';

//use this for displaying data only.
//any graph data manipulation should be done in the container class
const nodeSize = 0.15;
const nodeResolution = 30;

const Graph = props => {
  console.log(props);

  let ref = null;

  const getNodeLabel = node => {
    return node.id;
  };
  const getNodeColor = node => {
    return props.nodeColors[node.id];
  };
  // const onNodeClick = node => {};
  const getEdgeColor = edge => {
    return props.edgeColors[edge.colorIndex];
  };
  const getEdgeWidth = edge => {
    return 0;
  };

  useEffect(() => {
    //component did mount
    props.setCamera(ref, props.name);
  }, [props, ref]);

  console.log(props);

  const handleLinkVisibility = edge =>
    props.shouldSetEdgeVisibility && props.edgeWeightRange
      ? props.edgeWeightRange[0] <= edge.weight &&
        edge.weight <= props.edgeWeightRange[1]
      : true;

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
      onNodeClick={node => props.onNodeClick(node)}
      linkColor={edge => getEdgeColor(edge)}
      linkWidth={edge => getEdgeWidth(edge)}
      nodeOpacity={1}
      width={props.size.width}
      linkVisibility={handleLinkVisibility}
    />
  );
};

export default React.memo(Graph, (prevProps, nextProps) => {
  console.log(prevProps, nextProps);
  return prevProps.width !== nextProps.width;
});
