// day 04

type Range = [number, number];
type Input = [Range, Range][];

const parseInput = (input: string, safe?: boolean): Input =>
  input
    .split("\n")
    .filter(safe ? (line) => line.match(/^[0-9]+-[0-9]+,[0-9]+-[0-9]+$/) : Boolean)
    .map((line) => line.split(",").map((pair) => pair.split("-").map(Number))) as Input;

export const solvePartOne = (input: string) =>
  parseInput(input).filter(([a, b]) => envelops(a, b)).length;

export const solvePartTwo = (input: string) =>
  parseInput(input).filter(([a, b]) => overlaps(a, b)).length;

// helpers

const len = ([a, b]: Range) => b - a;
const envelops = (a: Range, b: Range): boolean => {
  if (len(a) > len(b)) {
    return b[0] >= a[0] && b[1] <= a[1];
  } else {
    return a[0] >= b[0] && a[1] <= b[1];
  }
};
const overlaps = (a: Range, b: Range): boolean => Math.max(a[0], b[0]) <= Math.min(a[1], b[1]);

// tests

if (import.meta.vitest) {
  const input = await readFile("example", 4);
  test.only("part one", () => {
    expect(solvePartOne(input)).toEqual(2);
  });
  test("part two", () => {
    expect(solvePartTwo(input)).toEqual(4);
  });
}
