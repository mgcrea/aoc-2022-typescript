type Move = 0 | 1 | 2;
type Round = [Move, Move];
type Input = Round[];

const parseInput = (input: string, unsafe?: boolean): Input =>
  input
    .split("\n")
    .filter(unsafe ? Boolean : (line) => line.match(/^[ABC] [XYZ]$/))
    .map((line) => [line.charCodeAt(0) - 65, line.charCodeAt(2) - 88]) as Input;

const computeScore = ([a, b]: Round): number => {
  const score = ((3 - ((2 + a - b) % 3)) % 3) * 3;
  return score + b + 1;
};

export const solvePartOne = (input: string) => parseInput(input).map(computeScore).reduce(sum);

export const solvePartTwo = (input: string) =>
  parseInput(input)
    .map(([a, r]) => {
      const b = match(r, {
        0: (a + 2) % 3,
        1: a,
        2: (a + 1) % 3,
      });
      return computeScore([a, b as Move]);
    })
    .reduce(sum);

// Helpers

const sum = (a: number, b: number) => a + b;

const match = <T, U extends string | number | symbol = string | number | symbol>(
  value: U,
  map: Record<U, T>
): T => {
  return map[value];
};
