import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';


import FileUpload from './file_upload';
import Info from './info';
import Verify from './verify';
import Submission from './submission';
import {new_graph} from '../../utils/graphvis_api'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  stepper: {
    width: '80%'
  },
  fileupload:{
    width: '80%'
  }
}

const step = {
  'INFO': 0,
  'CONTROL': 1,
  'OCD': 2,
  'VERIFY': 3,
  'SUBMIT': 4
}

const stepTitles = ['Control Group Data', 'OCD Group Data', 'Submit']

const fileObj = (name) => {
  return {
    name: name,
    edge_list: null,
    weight_matrix: null,
    coordinates: null,
    node_names: null,
    node_ids: null,
    orbits: null,
  }
}

const graph_set_data = () =>{
  return {
    name: null,
    creator: null,
    date: null
  }
}

class GraphUpload extends Component {
  constructor(props) {
    super(props);

    
    this.state = {
      activeStep: step.INFO,
      completedSteps: new Set(),
      control_files: fileObj('control'),
      ocd_files: fileObj('ocd'),
      graph_metadata: graph_set_data(),
      submission_errors: null,
      submission_hash: null,
      submission_status: null
    }

    this.stepCompleted = this.stepCompleted.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.getNavButtons = this.getNavButtons.bind(this);
    this.handleGoToGraph = this.handleGoToGraph.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  stepCompleted(index) {
    return !this.state.completedSteps.has(index);
  }
  handleBack() {
    let activeStep = this.state.activeStep;
    this.setState({ activeStep: activeStep - 1 })
  }

  handleNext() {
    let activeStep = this.state.activeStep;
    if (this.state.completedSteps.has(activeStep)) {
      this.setState({ activeStep: activeStep + 1 })
    }
  }

  handleComplete(name) {
    console.log(this.state.completedSteps)
    this.state.completedSteps.add(this.state.activeStep);
    this.forceUpdate();
  }

  handleGoToGraph(){

  }

  handleSubmit(){
    new_graph(this.state.ocd_files, 
            this.state.control_files, 
            this.state.graph_metadata)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error)
    })
  }

  getNavButtons(index) {
    if (index === step.INFO) {
      return (
        <div  className="montserrat">
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" disabled={!this.state.completedSteps.has(index)} onClick={this.handleNext}>Next</Button>
        </div>
      )
    } else if (index === step.CONTROL){
      return (
        <div  className="montserrat">
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" onClick={this.handleBack}>Back</Button>
          <Button color="primary" disabled={!this.state.completedSteps.has(step.CONTROL)} onClick={this.handleNext}>Next</Button>
        </div>
      )
    } else if (index === step.OCD) {
      return (
        <div>
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" onClick={this.handleBack}>Back</Button>
          <Button color="primary" disabled={!this.state.completedSteps.has(index)} onClick={this.handleNext}>Verify</Button>
        </div>
      )
    } else if (index === step.VERIFY) {
      return (
        <div>
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" onClick={this.handleBack}>Back</Button>
          <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
        </div>
      )
    } else if (index === step.SUBMIT){
      if(this.state.submission_status === 'error'){
        return (
          <Button color="primary" onClick={this.handleBack}>Back</Button>
        )
      } else if (this.state.submission_status === 'success'){
        return (
          <Button color="primary" onClick={this.handleGoToGraph}>Go to Graph</Button>
        )
      }
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <Stepper activeStep={this.state.activeStep} style={styles.stepper}>
          {stepTitles.map((label, index) => {
            const stepProps = {}
            if (!this.stepCompleted(index)) {
              stepProps.completed = true;
            }
            return (
              <Step  key={index} {...stepProps}>
                <StepLabel ><span className="montserrat">{label}</span></StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <div style={styles.fileupload}>
          {/* content goes here */}
          <Info
            show={this.state.activeStep === step.INFO}
            data={this.state.graph_metadata}
            onComplete={this.handleComplete}
          />
          <FileUpload 
            onComplete={this.handleComplete} 
            graphData={this.state.control_files}
            name='control'
            show={this.state.activeStep === step.CONTROL}
          />
                {/* TODO: Add a feature to allow a user to press a checkbox to use the same coordinates, node_ids, and node_names for both graphs
                That would be on this FileUpload component.*/}
          <FileUpload 
            onComplete={this.handleComplete} 
            graphData={this.state.ocd_files}
            name='ocd'
            show={this.state.activeStep === step.OCD}
          />
          <Verify
            metadata={this.state.graph_metadata}
            control_files = {this.state.control_files}
            ocd_files = {this.state.ocd_files}
            show={this.state.activeStep === step.VERIFY}
          />
          <Submission
            status={this.state.submission_status}
            errors={this.state.submission_errors}
            hash={this.state.submission_hash}
            show={this.state.activeStep === step.SUBMIT}
          />  
        </div>
        <div>
          {/* nav buttons here  */}
          {this.getNavButtons(this.state.activeStep)}
        </div>
      </div>
    )
  }

}

export default GraphUpload;