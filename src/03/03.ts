// day 03

type Input = number[][];

const parseInput = (input: string, safe?: boolean): Input =>
  input
    .split("\n")
    .filter(safe ? (line) => line.match(/^[a-zA-Z]$/) : Boolean)
    .map((line) => Array.from(line).map((char) => scoreForChar(char.charCodeAt(0))));

const scoreForChar = (code: number) => (code % 32) + 26 * Number(code <= 90);

export const solvePartOne = (input: string) =>
  parseInput(input)
    .map(split)
    .map(([a, b]) => intersect(new Set(a), new Set(b)))
    .filter(isNumber)
    .reduce(sum);

export const solvePartTwo = (input: string) => {
  const parsed = parseInput(input).map((items) => new Set(items));
  let sum = 0;
  for (let i = 0; i < parsed.length / 3; i++) {
    const [a, b, c] = parsed.slice(3 * i, 3 * (i + 1));
    sum += intersect(a as Set<number>, b as Set<number>, c as Set<number>) ?? 0;
  }
  return sum;
};

// helpers

const split = <T>(array: T[]): [T[], T[]] => {
  const length = array.length / 2;
  return [array.slice(0, length), array.slice(length)];
};

const intersect = <T extends number>(...sets: Set<T>[]): T | null => {
  const sizes = sets.map((set) => set.size);
  const index = sizes.indexOf(Math.min(...sizes));
  const set = sets.splice(index, 1)[0] as Set<T>;
  for (const v of set.values()) {
    if (sets.every((set) => set.has(v))) {
      return v;
    }
  }
  return null;
};

const isNumber = (a: unknown): a is number => typeof a === "number" && !isNaN(a);

const sum = (a: number, b: number) => a + b;

// tests

if (import.meta.vitest) {
  const input = await readFile("example", 3);
  test("part one", () => {
    expect(solvePartOne(input)).toEqual(157);
  });
  test("part two", () => {
    expect(solvePartTwo(input)).toEqual(70);
  });
}
