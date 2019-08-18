import React, { Component } from 'react'
import Upload from './upload';
import { thisExpression } from '@babel/types';

const styles = {
  root:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%'
  }
}

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edge_list: undefined,
      weight_list: undefined,
      coordinates: undefined,
      node_names: undefined,
      node_ids: undefined,
      orbits: undefined,
      fileCount: 0
    }

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount(){
    console.log(this.props.name)
  }

  handleFileUpload(file, name){
    let fileCount = this.state.fileCount;
    console.log(file)
    this.setState({[name]: file, fileCount: fileCount + 1}, () => {
      if(this.state.fileCount === 6){
        let files = {
          edge_list: this.state.edge_list,
          weight_matrix: this.state.weight_matrix,
          coordinates: this.state.coordinates,
          node_names: this.state.node_names,
          node_ids: this.state.node_ids,
          orbits: this.state.orbits,
        }
        this.props.onComplete(this.props.name, files)
      }
    })
  }

  render() {
    if(!this.props.show){
      return <div/>;
    } else {
      return (
        <div style={styles.root}>
          <div style={styles.uploadContainer}>
            <Upload filename='Edge List' name='edge_list' handleUpload={this.handleFileUpload}/>
            <Upload filename='Weight Matrix' name='weight_matrix' handleUpload={this.handleFileUpload}/>
            <Upload filename='Coordinates' name='coordinates' handleUpload={this.handleFileUpload}/>
            <Upload filename='Node Names' name='node_names' handleUpload={this.handleFileUpload}/>
            <Upload filename='Node IDs' name='node_ids' handleUpload={this.handleFileUpload}/>
            <Upload filename='Orbits' name='orbits' handleUpload={this.handleFileUpload}/>
          </div>
        </div>
      )
    }

  }
}
