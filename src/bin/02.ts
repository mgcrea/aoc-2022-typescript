const DAY = 2;

enum Move {
  Rock,
  Paper,
  Scissors,
}
type Round = [Move, Move];

enum Outcome {
  Win,
  Draw,
  Loss,
}
type Strategy = [Move, Outcome];

const parseInput = <T>(input: string, safe?: boolean): T =>
  input
    .split("\n")
    .filter(safe ? (line) => line.match(/^[ABC] [XYZ]$/) : Boolean)
    .map((line) => [line.charCodeAt(0) - 65, line.charCodeAt(2) - 88]) as T;

const computeScore = ([their, ours]: Round): number => {
  const score = ((3 - ((2 + their - ours) % 3)) % 3) * 3;
  return score + ours + 1;
};

export const solvePartOne = (input: string) =>
  parseInput<Round[]>(input).map(computeScore).reduce(sum);

export const solvePartTwo = (input: string) =>
  parseInput<Strategy[]>(input)
    .map(([their, outcome]) => {
      const ours = match<Move>(outcome, {
        [Outcome.Win]: (their + 2) % 3,
        [Outcome.Draw]: their,
        [Outcome.Loss]: (their + 1) % 3,
      });
      return computeScore([their, ours]);
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
