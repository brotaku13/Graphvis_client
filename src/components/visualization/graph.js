import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Graph = ({ match }) => {
  const [graphData, setGraphData] = useState({
    cytoscape: {},
    forceGraph: {},
  })
  console.log(graphData, setGraphData) // to silence errors for now

  const {
    params: { id },
  } = match
  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get('https://httpbin.org/get')
        console.log(response.data)
      } catch (exception) {
        console.error(exception)
      }
    })()
  })

  return <div>ID: {id}</div>
}

export default Graph
