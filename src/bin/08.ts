const DAY = 0;

type Input = string[];

const parseInput = (input: string): Input => input.trim().split("\n\n");

export const solvePartOne = (input: string) => {
  const parsedInput = parseInput(input);
  // d({ parsedInput });
  return null;
};
export const solvePartTwo = (input: string) => {
  return null;
};

// helpers

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test.only(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(null);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(null);
  });
}
