import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './components/homepage'
// ^ index.js hurts IDE path intellisense
import Graph from './components/visualization/graph'
import Explore from './components/explore/explore'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/id/:id" component={Graph} />
        <Route path="/explore" component={Explore} />
      </BrowserRouter>
    )
  }
}

export default App
