import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/homepage';
// ^ index.js hurts IDE path intellisense
import Visualization from './components/visualization';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/id/:id" component={Visualization} />
        <Route path="/explore" component={Visualization} />
      </BrowserRouter>
    );
  }
}

export default App;
