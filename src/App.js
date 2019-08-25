import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import HomePage from './components/homepage'
import Graph from './components/visualization/graph'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
        <Route path="/id/:id" component={Graph} />
      </BrowserRouter>
    )
  }
}

export default App
