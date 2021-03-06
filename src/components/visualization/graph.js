import React, { useEffect } from 'react';
import ForceGraph3d from 'react-force-graph-3d';
import { COLOR_BY } from '../../utils/Colors';

//use this for displaying data only.
//any graph data manipulation should be done in the container class
const nodeSize = 0.15;
const nodeResolution = 30;

const Graph = props => {

  let ref = null;

  const getNodeLabel = node => {
    let metric = '';

    if (props.currentMetric !== COLOR_BY.DEFAULT.value) {
      metric = `<div>
                  ${props.currentMetric}: ${node.metrics[props.currentMetric]}
                </div>`;
    }

    return `<div class="tooltip">
              <div>${node.fullName}</div>
              ${metric}
            </div>`;
  };
  const getNodeColor = node => {
    return props.nodeColors[node.id];
  };
  // const onNodeClick = node => {};
  const getEdgeColor = edge => {
    return props.edgeColors[edge.colorIndex];
  };

  useEffect(() => {
    //component did mount
    props.setCamera(ref, props.name);
  }, [props, ref]);


  const handleLinkVisibility = edge =>
    props.shouldShowEdges &&
    (props.shouldSetEdgeVisibility && props.edgeWeightRange
      ? props.edgeWeightRange[0] <= edge.weight &&
        edge.weight <= props.edgeWeightRange[1]
      : true);

  const handleLinkWidth = edge =>
    props.shouldShowEdgeWeights ? edge.weight : 0.1;

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
      nodeOpacity={1}
      width={props.size.width}
      linkVisibility={handleLinkVisibility}
      linkWidth={handleLinkWidth}
    />
  );
};

export default React.memo(Graph, (prevProps, nextProps) => {
  return prevProps.width !== nextProps.width;
});
