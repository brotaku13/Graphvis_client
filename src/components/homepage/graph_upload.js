import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';

import FileUpload from './file_upload';


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
  'CONTROL': 0,
  'OCD': 1,
  'FINAL': 2
}
const stepTitles = ['Control Group Data', 'OCD Group Data', 'Submit']

class GraphUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: step.CONTROL,
      completedSteps: new Set(),
      control_files: {},
      ocd_files: {}
    }
    this.stepCompleted = this.stepCompleted.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.getNavButtons = this.getNavButtons.bind(this);
  }

  stepCompleted(index) {
    return !this.state.completedSteps.has(index);
  }

  handleBack() {
    let activeStep = this.state.activeStep;
    this.setState({ activeStep: activeStep - 1 })
  }

  handleNext() {
    if (this.state.completedSteps.has(this.state.activeStep)) {
      this.setState({ activeStep: step.OCD })
    }
  }

  handleComplete(name, files) {

    if(name == 'control'){
      this.setState({control_files: files})
      console.log('have all files')
      this.state.completedSteps.add(step.CONTROL);

    } else if (name == 'ocd'){
      this.setState({ocd_files: files})
      this.state.completedSteps.add(step.OCD);
    }
  }

  getNavButtons(index) {
    if (index === step.CONTROL) {
      return (
        <div  className="montserrat">
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" disabled={this.stepCompleted(index)} onClick={this.handleNext}>Next</Button>
        </div>
      )
    } else if (index === step.OCD) {
      return (
        <div>
          <Button color="primary" onClick={() => this.props.handleCancel()}>Cancel</Button>
          <Button color="primary" onClick={this.handleBack}>Back</Button>
          <Button color="primary" disabled={this.stepCompleted(index)} onClick={this.handleSubmit}>Submit</Button>
        </div>
      )
    } else {
      return (
        <Button color="primary" disabled={this.stepCompleted(index)} onClick={this.handleFinish}>Finish</Button>
      )
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
          <FileUpload 
            onComplete={this.handleComplete} 
            name='control'
            show={this.state.activeStep === step.CONTROL}
          />
          <FileUpload 
            onComplete={this.handleComplete} 
            name='ocd'
            show={this.state.activeStep === step.OCD}
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