export const solvePartOne = (input: string) => {
  return input
    .trim()
    .split("\n\n")
    .map((value) => value.split("\n").reduce((soFar, item) => soFar + parseInt(item), 0))
    .reduce((a, b) => (a > b ? a : b));
};

export const solvePartTwo = (input: string) => {
  return input
    .trim()
    .split("\n\n")
    .map((value) => value.split("\n").reduce((soFar, item) => soFar + parseInt(item), 0))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((soFar, value) => soFar + value);
};
