import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';

import Login from "./components/Auth/Login";
import Graphvis from "./components/main/Graphvis";

export default class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/" component={Graphvis}/>
      </BrowserRouter>
    )
  }
}
