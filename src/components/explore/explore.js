import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
      Random ID: {randomID}. Has server errored: {hasErrored.toString()}
    </div>
  )
}

export default Explore
