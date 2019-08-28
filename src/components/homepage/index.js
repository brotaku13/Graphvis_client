import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { withRouter } from 'react-router-dom';

import bg from '../../assets/images/graph_background.jpg';
import UploadContainer from './UploadContainer';

const styles = {
  root: {
    backgroundImage: `url(${bg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50%',
    position: 'absolute',
    width: '100%',
    height: '100%',
    overlay: 'hidden',
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
  },
  loginPaper: {
    zIndex: 10,
    width: '50vw',
    display: 'flex',
    padding: '1em',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loginTitle: {
    zIndex: 10,
    marginTop: '1.5em',
    marginBottom: '0.5em',
    fontSize: '2em',
  },
  graphIDTextfield: {
    width: '80%',
    marginBottom: '2em',
  },
  error: {
    marginTop: '5%',
    color: '#ff1744',
    fontSize: '.8em',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: '1em',
    marginRight: '1em',
  },
};

const Home = props => {
  const [graphId, setGraphId] = useState('');
  const [showUi, setShowUi] = useState({
    about: false,
    home: true,
    new: false,
  });

  const handleNewGraph = () => {
    setShowUi({
      ...showUi,
      home: false,
      new: true,
    });
  };

  const handleCancel = () => {
    setShowUi({
      ...showUi,
      home: true,
      new: false,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.history.push(`/id/${graphId}`);
  };

  const onTextField = e => {
    setGraphId(e.target.value);
  };

  const onExplore = () => {
    //query server for random graph and then do the same as handleSubit
  };

  return (
    <div className="graph-root" style={styles.root}>
      <div style={styles.content}>
        <div className="title">
          <Typography variant="h1">Graphvis</Typography>
        </div>
        <div style={styles.container}>
          <div>
            <Slide
              direction="right"
              in={showUi.home}
              mountOnEnter
              unmountOnExit
            >
              <Paper style={styles.loginPaper} elevation={4}>
                <div style={styles.loginTitle}>
                  <Typography variant="h4">Enter a Graph ID</Typography>
                </div>
                <div style={styles.graphIDTextfield}>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      id="graph_id_textfield"
                      name="graph_id"
                      label="Graph ID"
                      palceholder="Enter here"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={onTextField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </div>
                <div style={styles.buttonContainer}>
                  <Typography>Don't have a graph ID?</Typography>
                  <div style={styles.buttonGroup}>
                    <Button
                      color="primary"
                      style={styles.navButton}
                      onClick={handleNewGraph}
                    >
                      Create
                    </Button>
                    <Button
                      color="primary"
                      style={styles.navButton}
                      onClick={handleNewGraph}
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </Paper>
            </Slide>
          </div>
          <div>
            <Slide direction="left" in={showUi.new} mountOnEnter unmountOnExit>
              <Paper style={styles.loginPaper} elevation={4}>
                <UploadContainer cancel={handleCancel} />
              </Paper>
            </Slide>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
