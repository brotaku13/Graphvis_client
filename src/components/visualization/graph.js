import React from 'react'

import GraphUI from '../core/graph_ui.js'

const Graph = ({ match }) => {
  const {
    params: { id },
  } = match

  return (
    <div>
      <div>ID: {id}</div>
      <GraphUI id={id} />
    </div>
  )
}

export default Graph
