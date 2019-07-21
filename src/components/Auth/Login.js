import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import GoogleButton from 'react-google-button';

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
  },
  loginButton:{
    width: '95%'
  }
}

class Login extends Component {
  constructor(props){
    super(props);

    this.googleAuth = this.googleAuth.bind(this);
  }
  googleAuth(e) {

  }

  render() {
    return (
      <div style={styles.root}>
        <div className="title" styles={styles.title}>
          Graphvis
        </div>
        <div>
          <Paper style={styles.loginPaper} elevation={4}>
            <div className="login" style={styles.loginTitle}>
              Login
            </div>
            <GoogleButton style={styles.loginButton} onClick={this.googleAuth}/>
          </Paper>
        </div>
      </div>
    )
  }
}

export default Login