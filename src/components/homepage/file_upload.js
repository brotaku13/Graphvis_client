import React, { Component } from 'react'
import Upload from './upload';

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
      fileCount: 0
    }
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount(){
    console.log(this.props.name)
  }

  handleFileUpload(file, name){
    let fileCount = this.state.fileCount + 1;
    console.log(file)
    this.props.graphData[name] = file
    this.setState({fileCount: fileCount})
    if(fileCount === 1){
      this.props.onComplete(this.props.name)
    }
  }

  render() {
    let rootStyles = {...styles.root}
    if(!this.props.show){
      rootStyles.display = 'none'
    }
    return (
      <div style={rootStyles}>
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
