<<<<<<< HEAD
import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withRouter } from "react-router-dom";

import GraphContainer from './GraphContainer'
=======
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
>>>>>>> 90eb40c689e27d2eec8fce6cd1d9ecfd4f78eaa8

import { makeStyles, useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';

import { getGraph } from '../../utils/GraphvisAPI';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    fontSize: '1em',
    position: 'relative',
    paddingBottom: '0.25em',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
<<<<<<< HEAD
    paddingTop: theme.spacing(3),
    transition: theme.transitions.create("margin", {
=======
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
>>>>>>> 90eb40c689e27d2eec8fce6cd1d9ecfd4f78eaa8
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  grow: {
    flexGrow: 1,
  },
  hashSearch: {
    color: 'white',
    marginTop: '0.5em',
  },
  graphTitle: {
    marginTop: '0.5em',
  },
  graphInfo: {
<<<<<<< HEAD
    display: "flex",
    flexDirection: "column"
  },
  graphContainer:{
    marginTop: '1em'
  }
=======
    display: 'flex',
    flexDirection: 'column',
  },
>>>>>>> 90eb40c689e27d2eec8fce6cd1d9ecfd4f78eaa8
}));

const Visualization = props => {
  const graphId = props.match.params.id;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [graphSearchField, setGraphSearchField] = useState(graphId);
<<<<<<< HEAD
=======
  const [graphData, setGraphData] = useState({});

  // componentDidMount
  useEffect(() => {
    (async () => {
      try {
        const graph = await getGraph(graphId);
        console.log(`getGraph ${graphId} ${graph}`);
        console.log(graph);
      } catch (exception) {
        console.log(exception);
      }
    })();
  }, []);
>>>>>>> 90eb40c689e27d2eec8fce6cd1d9ecfd4f78eaa8

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  const handleNewSearch = e => {
    e.preventDefault();
    props.history.push(`/id/${graphSearchField}`);
  };

  const handleTextSearch = e => {
    setGraphSearchField(e.target.value);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar variant="dense">
          <div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Typography variant="h6" className={classes.graphTitle} noWrap>
            UCI Graphvis
          </Typography>
          <div className={classes.grow} />
          <form onSubmit={handleNewSearch}>
            <TextField
              id="standard-bare"
              InputProps={{
                className: classes.hashSearch,
                startAdornment: (
                  <InputAdornment position="start" style={{ color: 'white' }}>
                    <Typography>ID:</Typography>
                  </InputAdornment>
                ),
              }}
              defaultValue={graphId}
              margin="dense"
              onChange={handleTextSearch}
            />
          </form>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.graphInfo}>
            <Typography noWrap>Graph Name </Typography>
            <Typography noWrap>Author Name</Typography>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.graphContainer}>
        <GraphContainer
          graphId="5d637a5fa6ee4455a9003857"
        />
        </div>
      </main>
    </div>
  );
};

export default withRouter(Visualization);
