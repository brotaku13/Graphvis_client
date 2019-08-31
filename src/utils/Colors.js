import chroma from 'chroma-js';

export const adjustBrightness = (col, amt) => {
  var usePound = false;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  var R = parseInt(col.substring(0, 2), 16);
  var G = parseInt(col.substring(2, 4), 16);
  var B = parseInt(col.substring(4, 6), 16);

  // to make the colour less bright than the input
  // change the following three "+" symbols to "-"
  R = R + amt;
  G = G + amt;
  B = B + amt;

  if (R > 255) R = 255;
  else if (R < 0) R = 0;

  if (G > 255) G = 255;
  else if (G < 0) G = 0;

  if (B > 255) B = 255;
  else if (B < 0) B = 0;

  var RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return (usePound ? '#' : '') + RR + GG + BB;
};

export const setLightPercentage = (col, p) => {
  const R = parseInt(col.substring(1, 3), 16);
  const G = parseInt(col.substring(3, 5), 16);
  const B = parseInt(col.substring(5, 7), 16);
  const curr_total_dark = 255 * 3 - (R + G + B);

  // calculate how much of the current darkness comes from the different channels
  const RR = (255 - R) / curr_total_dark;
  const GR = (255 - G) / curr_total_dark;
  const BR = (255 - B) / curr_total_dark;

  // calculate how much darkness there should be in the new color
  const new_total_dark = (255 - 255 * (p / 100)) * 3;

  // make the new channels contain the same % of available dark as the old ones did
  const NR = 255 - Math.round(RR * new_total_dark);
  const NG = 255 - Math.round(GR * new_total_dark);
  const NB = 255 - Math.round(BR * new_total_dark);

  const RO =
    NR.toString(16).length === 1 ? '0' + NR.toString(16) : NR.toString(16);
  const GO =
    NG.toString(16).length === 1 ? '0' + NG.toString(16) : NG.toString(16);
  const BO =
    NB.toString(16).length === 1 ? '0' + NB.toString(16) : NB.toString(16);

  return '#' + RO + GO + BO;
};

export const hslaString = (h, s, l, a) => {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

export const getColorPair = (h, s, l, a, lighten) => {
  return {
    selected: hslaString(h, s, l, a),
    unselected: hslaString(h, s, l, lighten),
  };
};
//hsla(282, 55%, 55%, 1)
export const colorScale = chroma
  .scale(['purple', 'blue', 'cyan', 'green', 'yellow', 'red'])
  .mode('lch')
  .colors(100)
  .map(hex => chroma(hex).css());

export default {};
