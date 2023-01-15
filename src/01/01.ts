type Input = number[][];

const parseInput = (input: string, unsafe?: boolean): Input =>
  input
    .trim()
    .split("\n\n")
    .map((value) =>
      value
        .split("\n")
        .filter(unsafe ? Boolean : (line) => line.match(/^[0-9]*$/))
        .map((v) => parseInt(v))
    );

export const solvePartOne = (input: string) =>
  parseInput(input)
    .map((value) => value.reduce(sum))
    .reduce(max);

export const solvePartTwo = (input: string) =>
  parseInput(input)
    .map((value) => value.reduce(sum))
    .slice(0, 3)
    .reduce(sum);

// Helpers

const sum = (a: number, b: number) => a + b;
const max = (a: number, b: number) => (a > b ? a : b);
