import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Slide from '@material-ui/core/Slide'

import bg from '../../assets/images/graph_background.jpg'
import GraphUpload from './graph_upload'

const styles = {
  root: {
    backgroundImage: `url(${bg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'hidden',
    backgroundPosition: '90%',
    height: '98vh',
    width: '99vw',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
  },
  loginPaper: {
    marginTop: '5em',
    height: '38vh',
    width: '50vw',
    display: 'flex',
    padding: '1em',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loginTitle: {
    marginTop: '2em',
    marginBottom: '1.5em',
    fontSize: '2em',
  },
  graphIDTextfield: {
    width: '80%',
    marginBottom: '2em',
  },
  newGraphButtonGroup: {},
  error: {
    marginTop: '5%',
    color: '#ff1744',
    fontSize: '.8em',
  },
}

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graph_id: '',
      graphIDDisplay: false,
      newGraphDisplay: true,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleNewGraphNav = this.handleNewGraphNav.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    alert(this.state.graph_id)
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleNewGraphNav() {
    this.setState({
      graphIDDisplay: false,
      newGraphDisplay: true,
    })
  }

  handleCancel() {
    this.setState({
      graphIDDisplay: true,
      newGraphDisplay: false,
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <div className="title" styles={styles.title}>
          Graphvis
        </div>
        <div style={styles.container}>
          <div>
            <Slide
              direction="right"
              in={this.state.graphIDDisplay}
              mountOnEnter
              unmountOnExit
            >
              <Paper style={styles.loginPaper} elevation={4}>
                <div className="montserrat" style={styles.loginTitle}>
                  Enter a Graph ID
                </div>
                <div style={styles.graphIDTextfield}>
                  <form onSubmit={this.handleSubmit}>
                    <TextField
                      id="graph_id_textfield"
                      name="graph_id"
                      label="Graph ID"
                      palceholder="Enter here"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={this.onChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </div>
                <div className="montserrat" style={styles.newGraphButtonGroup}>
                  Don't have a graph ID?
                  <Button color="primary" onClick={this.handleNewGraphNav}>
                    Create a new graph
                  </Button>
                </div>
              </Paper>
            </Slide>
          </div>
          <div>
            <Slide
              direction="left"
              in={this.state.newGraphDisplay}
              mountOnEnter
              unmountOnExit
            >
              <Paper style={styles.loginPaper} elevation={4}>
                <GraphUpload handleCancel={this.handleCancel} />
              </Paper>
            </Slide>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage
