export const round = (number, decimal) => {
  let n = Math.pow(10, decimal);
  return Math.round(number * n) / n;
};

export default {};
