import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
    }
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  onChange(event) {
    console.log(this.state.data)

    let data = this.state.data
    data[event.target.name] = event.target.value
    this.setState({ data: data }, () => {
      if (this.state.data.name !== null && this.state.data.creator !== null) {
        this.props.onComplete()
      }
    })
  }
  handleSubmit(event) {
    console.log('herl')
    event.preventDefault()

    this.props.onComplete()
  }
  render() {
    let rootStyles = { ...styles.root }
    if (!this.props.show) {
      rootStyles.display = 'none'
    }
    return (
      <div style={rootStyles}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="name_field"
            name="name"
            label="Graph Name"
            palceholder="Enter here"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.onChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="creator_field"
            name="creator"
            label="Author"
            palceholder="Enter here"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.onChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <button style={{ display: 'none' }} type="submit" />
        </form>
      </div>
    )
  }
}
