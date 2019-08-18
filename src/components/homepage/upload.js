import Button from '@material-ui/core/Button';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import PublishIcon from '@material-ui/icons/Publish';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import LinearProgress from '@material-ui/core/LinearProgress';

import React, { Component } from 'react'
const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button:{
    width: '30%',
    textAlign: 'left'
  },
  progress:{
    width: '60%',
    paddingTop: '1em'
  },
  iconContainer:{
    width: '30%',
    textAlign: 'right'
  },
  icon:{
    fontSize: 32,
    marginLeft: '5px'
  }
}
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      error: false,
      errorMessage: '',
      success: true,
      fileReceived: false
    }

    this.handleUpload = this.handleUpload.bind(this);
    this.getStatusIcon = this.getStatusIcon.bind(this);
  }

  handleUpload(event){
    if (event.target.files.length === 0){
      this.setState({
        error: true,
        errorMessage: 'No Files Selected'
      })
    } else {
      let file = event.target.files[0];
      this.setState({fileReceived: true});

      //verify file by making API call here
      this.setState({uploading: true}, () =>{
        setTimeout(() => {
          this.setState({uploading: false});
          this.props.handleUpload(file, this.props.name)
        }, 1000);
      })
    }
  }

  getStatusIcon(){
    if(!this.state.fileReceived){
      return (<PublishIcon style={styles.icon} color="primary"/>)
    } else if (!this.state.error){
      return (<CheckCircleOutlinedIcon style={styles.icon} color="primary"/>)
    } else if (this.state.error){
      return (<ErrorOutlineIcon style={styles.icon} color="error"/>)
    }
  }


  render() {
    return (
      <div style={styles.root}>
        <div style={styles.button}>
          <Button
            component="label"
            color="primary"
          >
            <span className="montserrat">{this.props.filename}</span>
            
            <input
              type="file"
              style={{ display: "none" }}
              onChange={this.handleUpload}
            />
          </Button>
        </div>
        <div style={styles.progress}>
          <LinearProgress hidden={!this.state.uploading}/>
        </div>
        <div style={styles.iconContainer}>
          {this.getStatusIcon()}
        </div>
      </div>
    )
  }
}
