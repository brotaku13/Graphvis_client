import React, { useState, useRef } from 'react';

import { useDebounce } from 'use-debounce';

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
import { colorScale } from '../../utils/Colors';

import useWindowDimensions from './useWindowDimensions';

const COLOR_BY = {
  NONE: 'none',
  DEGREE: 'degree',
  ORBIT_FREQUENCY: 'orbit_frequency',
  STRENGTH: 'strength',
  DEGREE_CENTRALITY: 'degree_centrality',
  ORBIT_CENTRALITY: 'orbit_centrality',
  BETWEEN_CENTRALITY: 'between_centrality',
};

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
    minWidth: 250,
    padding:
      '0 0.5rem 0 0.5rem' /* so slider right number doesn't get cut off */,
  },
  colorScale: {
    position: 'absolute',
    top: '5em',
    width: '100%',
    zIndex: 500,
    left: '50%',
    transform: 'translateX(-45%)',
  },
  labelsForColorScale: {
    position: 'absolute',
    top: '7em',
    width: '100%',
    zIndex: 500,
    left: '50%',
    transform: 'translateX(-45%)',
  },
  author: {
    display: 'inline-block',
  },
}));

const ColorScale = ({ className, labelClassName, min = 0, max = 100 }) => {
  const { width } = useWindowDimensions();
  const currentWidth = width - width / 10;
  const colorDivs = colorScale.map(v => (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: v,
        margin: 0,
        padding: 0,
        width: currentWidth / colorScale.length + 'px',
        height: '10px',
      }}
    />
  ));
  const labelDivs = [];
  for (let i = 0; i <= 100; ++i) {
    let text = null;
    if (i === 0 || i === 25 || i === 50 || i === 75 || i === 100) {
      const currentValue = min + Math.round((i / 100) * (max - min));
      text = i !== 0 ? currentValue.toString() : min;
    }
    labelDivs.push(
      <div
        style={{
          display: 'inline-block',
          margin: 0,
          padding: 0,
          width: currentWidth / colorScale.length + 'px',
          height: '10px',
        }}
      >
        {text}
      </div>,
    );
  }

  return (
    <>
      <div className={className}>{colorDivs}</div>
      <div className={labelClassName}>{labelDivs}</div>
    </>
  );
};

const Visualization = props => {
  const graphId = props.match.params.id;
  const classes = useStyles();
  const [drawerState, setDrawerState] = useState(false);
  const [colorByState, setColorByState] = useState(COLOR_BY.NONE);
  const [orbitFrequencyState, setOrbitFrequencyState] = useState(0);
  const [finalOrbitFrequencyState, setFinalOrbitFrequencyState] = useState(0);
  // TODO: Depending on the current colorByState (use an ENUM with constants + switch statement imo),
  // evaluate the min and max dynamically.
  const getColoringMinMax = () => {
    // Put graph functions here taht returns an array of 2
    switch (colorByState) {
      case COLOR_BY.NONE:
        return [-1];
      case COLOR_BY.DEGREE:
        return [20, 50];
      case COLOR_BY.ORBIT_FREQUENCY:
        return [20, 50];
      case COLOR_BY.STRENGTH:
        return [20, 50];
      case COLOR_BY.DEGREE_CENTRALITY:
        return [20, 50];
      case COLOR_BY.ORBIT_CENTRALITY:
        return [20, 50];
      case COLOR_BY.BETWEEN_CENTRALITY:
        return [20, 50];
      default:
        return [-1, -1];
    }
  };
  const [currentColoringMin, currentColoringMax] = getColoringMinMax();
  const [edgeWeightRangeState, setEdgeWeightRangeState] = useState([
    currentColoringMin,
    currentColoringMax,
  ]);
  const [debouncedEdgeWeightRangeState] = useDebounce(
    edgeWeightRangeState,
    1000,
  );
  const graphSearchRef = useRef();

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
    const value = parseInt(e.target.value);
    setOrbitFrequencyState(value === 'NaN' ? 0 : e.target.value);
  };

  const handleFinalOrbitFrequencyState = e => {
    const value = parseInt(e.target.value);
    setFinalOrbitFrequencyState(value === 'NaN' ? 0 : e.target.value);
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
        <ListItem className={classes.author}>
          <Typography align="center">by Brian Caulfield</Typography>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <FormControl fullWidth>
            <Typography id="edge-weight-range" gutterBottom>
              Edge Weight
            </Typography>
            <Slider
              marks={[
                {
                  value: currentColoringMin,
                  label: currentColoringMin,
                },
                {
                  value: currentColoringMax,
                  label: currentColoringMax,
                },
              ]}
              aria-labelledby="edge-weight-range"
              value={edgeWeightRangeState}
              onChange={handleEdgeWeightChange}
              min={currentColoringMin}
              max={currentColoringMax}
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
              <MenuItem value={COLOR_BY.NONE}>No Color</MenuItem>
              <MenuItem value={COLOR_BY.DEGREE}>Degree</MenuItem>
              <MenuItem value={COLOR_BY.ORBIT_FREQUENCY}>
                Orbit Frequency
              </MenuItem>
              <MenuItem value={COLOR_BY.STRENGTH}>Strength</MenuItem>
              <MenuItem value={COLOR_BY.DEGREE_CENTRALITY}>
                Degree Centrality
              </MenuItem>
              <MenuItem value={COLOR_BY.ORBIT_CENTRALITY}>
                Orbit Centrality
              </MenuItem>
              <MenuItem value={COLOR_BY.BETWEEN_CENTRALITY}>
                Between Centrality
              </MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          {colorByState && colorByState === COLOR_BY.ORBIT_FREQUENCY && (
            <form onSubmit={recolorNodesByOrbitFrequency}>
              <FormControl fullWidth>
                <TextField
                  value={orbitFrequencyState}
                  onChange={handleOrbitFrequencyChange}
                />
                <Button
                  color="primary"
                  onClick={handleFinalOrbitFrequencyState}
                >
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
          <Typography className={classes.graphTitle} variant="h6">
            Graph Title
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
          {colorByState !== COLOR_BY.NONE && (
            <ColorScale
              className={classes.colorScale}
              labelClassName={classes.labelsForColorScale}
              min={currentColoringMin}
              max={currentColoringMax}
            />
          )}
          <GraphContainer
            graphId={graphId}
            edgeWeightRange={debouncedEdgeWeightRangeState}
            colorBy={colorByState}
            orbitFrequency={finalOrbitFrequencyState}
          />
        </div>
      </main>
    </div>
  );
};

export default withRouter(Visualization);
