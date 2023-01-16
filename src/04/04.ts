type Input = [[number, number], [number, number]][];

const parseInput = (input: string, safe?: boolean): Input =>
  input
    .split("\n")
    .filter(safe ? (line) => line.match(/^[0-9]+-[0-9]+,[0-9]+-[0-9]+$/) : Boolean)
    .map((line) => line.split(",").map((pair) => pair.split("-").map(Number))) as Input;

export const solvePartOne = (input: string) =>
  parseInput(input)
    .map<number>(([a, b]) => {
      const la = len(a);
      const lb = len(b);
      if (la === lb) {
        return a[0] === b[0] ? 1 : 0;
      } else if (la > lb) {
        return b[0] >= a[0] && b[1] <= a[1] ? 1 : 0;
      } else {
        return a[0] >= b[0] && a[1] <= b[1] ? 1 : 0;
      }
    })
    .reduce(sum);

export const solvePartTwo = (input: string) =>
  parseInput(input)
    .map<number>(([a, b]) => {
      const la = len(a);
      const lb = len(b);
      if (la >= lb) {
        return inside(b[0], a) || inside(b[1], a) ? 1 : 0;
      } else {
        return inside(a[0], b) || inside(a[1], b) ? 1 : 0;
      }
    })
    .reduce(sum);

// helpers

const len = ([a, b]: [number, number]) => b - a;
const sum = (a: number, b: number) => a + b;
const inside = (a: number, [b, c]: [number, number]) => a >= b && b <= c;

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
