// day 01

type Input = number[][];

const parseInput = (input: string, safe?: boolean): Input =>
  input
    .trim()
    .split("\n\n")
    .map((value) =>
      value
        .split("\n")
        .filter(safe ? (line) => line.match(/^[0-9]*$/) : Boolean)
        .map(Number)
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

// helpers

const sum = (a: number, b: number) => a + b;
const max = (a: number, b: number) => (a > b ? a : b);
