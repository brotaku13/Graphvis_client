import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import GoogleButton from 'react-google-button';
import { Redirect } from 'react-router-dom';

import { withFirebase } from '../Firebase';

import bg from '../../assets/images/graph_background.jpg'

const styles = {
  root:{
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
    alignItems: 'center'
  },
  loginPaper:{
    marginTop: '5em',
    height: '38vh',
    width: '13vw',
    display: 'flex',
    padding: '1em',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  loginTitle:{
    marginTop: '2em',
    marginBottom: '1.5em',
    fontSize: '2em'
  },
  loginButton:{
    width: '95%'
  },
  loginButtons:{
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  error:{
    marginTop: '5%',
    color: '#ff1744',
    fontSize: '.8em'
  }
}

class Login extends Component {
  constructor(props){
    super(props);
    this.state ={
      loggedIn: false,
      errorState: ''
    }
    this.googleAuth = this.googleAuth.bind(this);
    this.getError = this.getError.bind(this);
  }
  googleAuth(e) {
    this.props.firebase.doLoginWithPopup(this.props.firebase.googleAuth)
    .then((result, error) => {
      this.setState({loggedIn: true})
    })
    .catch( error => {
      this.setState({errorState: error.message})
    })
  }

  getError(){
    if(!this.state.loggedIn && this.state.errorState !== ''){
      return `There was an error logging you in: ${this.state.errorState}`
    } else {
      return ''
    }
  }

  render() {
    if (this.state.loggedIn === true){
      return <Redirect to="/"/>
    }
    
    return (
      <div style={styles.root}>
        <div className="title" styles={styles.title}>
          Graphvis
        </div>
        <div>
          <Paper style={styles.loginPaper} elevation={4}>
            <div className="montserrat" style={styles.loginTitle}>
              Login
            </div>
            <div style={styles.loginButtons}>
              <GoogleButton style={styles.loginButton} onClick={this.googleAuth}/>
            </div>
            <div style={styles.error}  className="montserrat">
              {this.getError()}
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}

export default withFirebase(Login)