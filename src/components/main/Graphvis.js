import React, { Component } from 'react'
import { AuthUserContext } from '../Session';

const GraphVisApp = () => (
  <div>
    <AuthUserContext.Consumer>
      <Graphvis/>
    </AuthUserContext.Consumer>
  </div>
)

class Graphvis extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <div>
        Hello
        {this.props.authUser}
      </div>
    )
  }
}
export default Graphvis;