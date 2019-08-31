import chroma from 'chroma-js';

export const COLOR_BY = {
  DEFAULT: 'default',
  DEGREE: 'degree',
  ORBIT_FREQUENCY: 'orbit_frequency',
  STRENGTH: 'strength',
  DEGREE_CENTRALITY: 'degree_centrality',
  ORBIT_CENTRALITY: 'orbit_centrality',
  BETWEEN_CENTRALITY: 'between_centrality',
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
  return getColorPair(
    colorScale[percentIndex],
    nodeSettings.lighten,
    nodeSettings.alpha,
  );
};

export default {};
