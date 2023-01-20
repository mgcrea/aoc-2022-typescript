const DAY = 2;

type Move = 0 | 1 | 2;
type Round = [Move, Move];
type Input = Round[];

const parseInput = (input: string, safe?: boolean): Input =>
  input
    .split("\n")
    .filter(safe ? (line) => line.match(/^[ABC] [XYZ]$/) : Boolean)
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

// helpers

const sum = (a: number, b: number) => a + b;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const match = <T, K extends keyof any = keyof any>(value: K, map: Record<K, T>): T => {
  return map[value];
};

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(15);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(12);
  });
}
