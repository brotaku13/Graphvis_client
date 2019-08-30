import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import GraphContainer from './GraphContainer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, withRouter } from 'react-router-dom';
import { FormControl } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';

import chroma from 'chroma-js';

import useWindowDimensions from './useWindowDimensions';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
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
    color: '#fff',
    marginTop: '0.5em',
    textDecoration: 'none',
    '&:active': { textDecoration: 'none' },
    '&:hover': { textDecoration: 'none' },
    '&:visited': { textDecoration: 'none' },
    '&:focus': { textDecoration: 'none' },
  },
  graphInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    width: 250,
  },
  colorScale: {
    position: 'absolute',
    top: '5em',
    width: '100%',
    zIndex: 9999,
    left: '50%',
    transform: 'translateX(-45%)',
  },
}));

const colorScale = (max = 100) =>
  chroma
    .scale(['purple', 'blue', 'cyan', 'green', 'yellow', 'red'])
    .mode('lch')
    .colors(max)
    .map(hex => chroma(hex).css());

const ColorScale = ({ values, className }) => {
  const { width } = useWindowDimensions();
  const currentWidth = width - width / 10;
  const colorDivs = values.map(v => (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: v,
        margin: 0,
        padding: 0,
        width: currentWidth / values.length + 'px',
        height: '10px',
      }}
    />
  ));

  return <div className={className}>{colorDivs}</div>;
};

const Visualization = props => {
  const graphId = props.match.params.id;
  const classes = useStyles();
  const [drawerState, setDrawerState] = useState(false);
  const [colorByState, setColorByState] = useState('none');
  const [orbitFrequencyState, setOrbitFrequencyState] = useState(0);
  const [edgeWeightRangeState, setEdgeWeightRangeState] = useState([0, 100]);
  const graphSearchRef = useRef();
  const currentColorScale = colorScale();

  const handleNewSearch = e => {
    e.preventDefault();
    if (graphSearchRef) {
      props.history.push(`/id/${graphSearchRef.current.value}`);
    }
  };

  const handleChangeColorBy = e => {
    setColorByState(e.target.value);
  };

  const handleOrbitFrequencyChange = e => {
    setOrbitFrequencyState(parseInt(e.target.value));
  };

  const handleEdgeWeightChange = (e, newValue) => {
    setEdgeWeightRangeState(newValue);
  };

  const recolorNodesByOrbitFrequency = () => {
    alert('recolor the nodes!');
  };

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerState(open);
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem>
          <FormControl fullWidth>
            <Typography id="edge-weight-range" gutterBottom>
              Edge Weight
            </Typography>
            <Slider
              aria-labelledby="edge-weight-range"
              value={edgeWeightRangeState}
              onChange={handleEdgeWeightChange}
            />
          </FormControl>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel htmlFor="color-by">Color Nodes By</InputLabel>
            <Select
              value={colorByState}
              onChange={handleChangeColorBy}
              inputProps={{
                name: 'color-by',
                id: 'color-by',
              }}
            >
              <MenuItem value={'none'}>No Color</MenuItem>
              <MenuItem value={'degree'}>Degree</MenuItem>
              <MenuItem value={'orbit_frequency'}>Orbit Frequency</MenuItem>
              <MenuItem value={'strength'}>Strength</MenuItem>
              <MenuItem value={'degree_centrality'}>Degree Centrality</MenuItem>
              <MenuItem value={'between_centrality'}>
                Between Centrality
              </MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          {colorByState && colorByState === 'orbit_frequency' && (
            <form onSubmit={recolorNodesByOrbitFrequency}>
              <FormControl fullWidth>
                <TextField
                  value={orbitFrequencyState}
                  onChange={handleOrbitFrequencyChange}
                />
                <Button color="primary" onClick={recolorNodesByOrbitFrequency}>
                  Go
                </Button>
              </FormControl>
            </form>
          )}
        </ListItem>
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Link to="/" className={classes.graphTitle}>
            <Typography variant="h6" noWrap>
              UCI Graphvis
            </Typography>
          </Link>
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
              inputRef={graphSearchRef}
            />
            <button style={{ display: 'none' }} />
          </form>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerState} onClose={toggleDrawer(false)}>
        {sideList('left')}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.graphContainer}>
          <ColorScale
            className={classes.colorScale}
            values={currentColorScale}
          />
          <GraphContainer graphId={graphId} />
        </div>
      </main>
    </div>
  );
};

export default withRouter(Visualization);
