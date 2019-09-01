import chroma from 'chroma-js';

export const COLOR_BY = {
  DEFAULT: {
    value: 'default',
    label: 'No Color',
  },
  DEGREE: {
    value: 'degree',
    label: 'Degree',
  },
  ORBIT_FREQUENCY: {
    value: 'orbit_frequency',
    label: 'Orbit Frequency',
  },
  STRENGTH: {
    value: 'strength',
    label: 'Strength',
  },
  DEGREE_CENTRALITY: {
    value: 'degree_centrality',
    label: 'Degree Centrality',
  },
  BETWEEN_CENTRALITY: {
    value: 'between_centrality',
    label: 'Between Centrality',
  },
};

export const COLOR_BY_LABELS = {
  [COLOR_BY.DEGREE.value]: COLOR_BY.DEGREE.label,
  [COLOR_BY.DEFAULT.value]: COLOR_BY.DEFAULT.label,
  [COLOR_BY.ORBIT_FREQUENCY.value]: COLOR_BY.ORBIT_FREQUENCY.label,
  [COLOR_BY.STRENGTH.value]: COLOR_BY.STRENGTH.label,
  [COLOR_BY.DEGREE_CENTRALITY.value]: COLOR_BY.DEGREE_CENTRALITY.label,
  [COLOR_BY.BETWEEN_CENTRALITY.value]: COLOR_BY.BETWEEN_CENTRALITY.label,
};

export const colorScale = chroma
  .scale(['purple', 'blue', 'cyan', 'green', 'yellow', 'red'])
  .mode('lch')
  .colors(101)
  .map(hex => chroma(hex).css());

const nodeSettings = {
  lighten: 2,
  alpha: 0.4,
  default: '#52248a',
};

const edgeSettings = {
  lighten: 3,
  alpha: 0.2,
  default: '#000000',
};

export const getColorPair = (color, lighten, alpha) => {
  return {
    selected: chroma(color).css(),
    unselected: chroma(color)
      .brighten(lighten)
      .alpha(alpha)
      .css(),
  };
};

export const DefaultNodeColors = getColorPair(
  nodeSettings.default,
  nodeSettings.lighten,
  nodeSettings.alpha,
);
export const DefaultEdgeColors = getColorPair(
  edgeSettings.default,
  edgeSettings.lighten,
  edgeSettings.alpha,
);

export const getColorByValue = (val, min, max) => {
  if (max === min) {
    return getColorPair(
      colorScale[100],
      nodeSettings.lighten,
      nodeSettings.alpha,
    );
  }
  let percentIndex = Math.round(((val - min) * 100) / (max - min));
  try {
    return getColorPair(
      colorScale[percentIndex],
      nodeSettings.lighten,
      nodeSettings.alpha,
    );
  } catch {
    console.log('Error Getting colors');
    debugger;
  }
};

export default {};
