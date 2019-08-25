import React, { useState, useEffect } from 'react'
import axios from 'axios'

import GraphUI from '../core/graph_ui.js'

const Explore = () => {
  const [randomID, setRandomID] = useState('') // so you know it's meant to be a String
  const [hasErrored, setHasErrored] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get('https://httpbin.org/get')
        console.log(response.data)
        setRandomID('somemongoidhere')
      } catch (exception) {
        console.error(exception)
        setHasErrored(true)
      }
    })()
  })

  return (
    <div>
      <div>
        Random ID: {randomID}. Has server errored: {hasErrored.toString()}
      </div>
      {randomID !== '' && <GraphUI randomID={randomID} />}
    </div>
  )
}

export default Explore
