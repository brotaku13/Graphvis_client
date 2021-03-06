import React, { useState, useRef } from 'react';

import { useDebounce } from 'use-debounce';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import GraphContainer from './GraphContainer';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, withRouter } from 'react-router-dom';
import { FormControl } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { colorScale, COLOR_BY } from '../../utils/Colors';

import useWindowDimensions from './useWindowDimensions';

const drawerWidth = 240;

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

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
    top: '3em',
    width: '100%',
    zIndex: 500,
    left: '50%',
    transform: 'translateX(-45%)',
  },
  labelsForColorScale: {
    position: 'absolute',
    top: '5em',
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
  const colorDivs = colorScale.map((v, i) => (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: v,
        margin: 0,
        padding: 0,
        width: currentWidth / colorScale.length + 'px',
        height: '10px',
      }}
      key={i}
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
        key={i}
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

const getGraphId = props => {
  if (props.match.path === '/explore') {
    return 'explore';
  } else {
    return props.match.params.id;
  }
};

const Visualization = props => {
  const graphId = getGraphId(props);

  const classes = useStyles();
  const [drawerState, setDrawerState] = useState(false);
  const [colorByState, setColorByState] = useState(COLOR_BY.DEFAULT.value);
  const [orbitFrequencyState, setOrbitFrequencyState] = useState(-1);
  const [finalOrbitFrequencyState, setFinalOrbitFrequencyState] = useState(0);
  const [graphTitle, setGraphTitle] = useState('');
  const [graphAuthor, setGraphAuthor] = useState('');
  const [
    selectedOrbitFrequencyColorOnce,
    setSelectedOrbitFrequencyColorOnce,
  ] = useState(false);

  const [isWeighted, setIsWeighted] = useState(true);

  const [colorScaleExtrema, setColorScaleExtrema] = useState([0, 100]);

  //slider logic
  const [edgeWeightRangeState, setEdgeWeightRangeState] = useState([
    0,
    Number.MAX_SAFE_INTEGER,
  ]);
  const [debouncedEdgeWeightRangeState] = useDebounce(
    edgeWeightRangeState,
    1000,
  );
  const [shouldShowEdges, setShouldShowEdges] = useState(true);
  const [edgeWeightSliderDisabled, setEdgeWeightSliderDisabled] = useState(
    true,
  );
  const [shouldShowEdgeWeights, setShouldShowEdgeWeights] = useState(true);
  const [sliderExtrema, setSliderExtrema] = useState({
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  });

  const graphSearchRef = useRef();
  const graphContainerRef = React.useRef();

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
    e.preventDefault();
    if(orbitFrequencyState > -1 && orbitFrequencyState < 73){
      setFinalOrbitFrequencyState(orbitFrequencyState);
      setSelectedOrbitFrequencyColorOnce(true);
    }
  };

  const handleEdgeWeightChange = (e, newValue) => {
    setEdgeWeightRangeState(newValue);
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

  const setEdgeWeightRange = (ocdEdges, conEdges) => {
    if (ocdEdges) {
      let min = Number.MAX_SAFE_INTEGER;
      let max = -1;
      [...ocdEdges, ...conEdges].every(e => {
        if (e.weight === undefined) {
          min = undefined;
          max = undefined;
          return false;
        } else if (e.weight < min) {
          min = e.weight;
        } else if (e.weight > max) {
          max = e.weight;
        }
        return true;
      });
      if (min !== undefined && max !== undefined) {
        min = Math.round(min * 1000) / 1000;
        max = Math.round(max * 1000) / 1000;
        setEdgeWeightRangeState([min, max]);
        setSliderExtrema({ min: min, max: max });
        setEdgeWeightSliderDisabled(false);
      } else {
        setEdgeWeightSliderDisabled(true);
        setIsWeighted(false);
      }
    }
  };

  const getSliderStep = () => {
    return (sliderExtrema.max + sliderExtrema.min) / 100;
  };

  const sideList = () => (
    <div className={classes.list} role="presentation" key={1}>
      <List>
        <ListItem className={classes.author}>
          <Typography align="center">
            {graphAuthor ? `By ${graphAuthor}` : 'No Author'}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldShowEdges}
                  onChange={() => setShouldShowEdges(!shouldShowEdges)}
                />
              }
              label="Show Edges"
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldShowEdgeWeights}
                  onChange={() =>
                    setShouldShowEdgeWeights(!shouldShowEdgeWeights)
                  }
                  disabled={!shouldShowEdges}
                />
              }
              label="Show Edge Weights"
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <Typography id="edge-weight-range" gutterBottom>
              Edge Weight
            </Typography>
            <Slider
              disabled={!shouldShowEdges || edgeWeightSliderDisabled}
              ValueLabelComponent={ValueLabelComponent}
              aria-labelledby="edge-weight-range"
              value={edgeWeightRangeState}
              onChange={handleEdgeWeightChange}
              min={sliderExtrema.min}
              max={sliderExtrema.max}
              step={getSliderStep()}
              marks={
                !edgeWeightSliderDisabled
                  ? [
                      { value: sliderExtrema.min, label: sliderExtrema.min },
                      { value: sliderExtrema.max, label: sliderExtrema.max },
                    ]
                  : []
              }
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
              <MenuItem value={COLOR_BY.DEFAULT.value}>
                {COLOR_BY.DEFAULT.label}
              </MenuItem>
              <MenuItem value={COLOR_BY.DEGREE.value}>
                {COLOR_BY.DEGREE.label}
              </MenuItem>
              <MenuItem value={COLOR_BY.ORBIT_FREQUENCY.value}>
                {COLOR_BY.ORBIT_FREQUENCY.label}
              </MenuItem>
              {isWeighted && (
                <MenuItem value={COLOR_BY.STRENGTH.value}>
                  {COLOR_BY.STRENGTH.label}
                </MenuItem>
              )}
              <MenuItem value={COLOR_BY.DEGREE_CENTRALITY.value}>
                {COLOR_BY.DEGREE_CENTRALITY.label}
              </MenuItem>
              <MenuItem value={COLOR_BY.BETWEEN_CENTRALITY.value}>
                {COLOR_BY.BETWEEN_CENTRALITY.label}
              </MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          {colorByState && colorByState === COLOR_BY.ORBIT_FREQUENCY.value && (
            <form onSubmit={handleFinalOrbitFrequencyState}>
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
        <ListItem>
          <FormControl fullWidth>
            <Button
              color="primary"
              onClick={() => graphContainerRef.current.deselectAll()}
            >
              Deselect All
            </Button>
          </FormControl>
        </ListItem>
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
            {graphTitle ? graphTitle : 'Title not Found'}
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
        {sideList()}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.graphContainer}>
          {colorByState !== COLOR_BY.DEFAULT.value && (
            <ColorScale
              className={classes.colorScale}
              labelClassName={classes.labelsForColorScale}
              min={colorScaleExtrema[0]}
              max={colorScaleExtrema[1]}
            />
          )}
          <GraphContainer
            graphId={graphId}
            edgeWeightRange={debouncedEdgeWeightRangeState}
            colorBy={colorByState}
            orbitId={finalOrbitFrequencyState}
            selectedOrbitIdBefore={selectedOrbitFrequencyColorOnce}
            setGraphTitle={setGraphTitle}
            setGraphAuthor={setGraphAuthor}
            shouldShowEdges={shouldShowEdges}
            shouldShowEdgeWeights={shouldShowEdgeWeights}
            shouldSetEdgeVisibility={!edgeWeightSliderDisabled}
            setEdgeWeightRange={setEdgeWeightRange}
            setColorScaleExtrema={setColorScaleExtrema}
            ref={graphContainerRef}
          />
        </div>
      </main>
    </div>
  );
};

export default withRouter(Visualization);
