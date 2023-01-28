const DAY = 11;

type Operation = ["+" | "*", number | "old"];

type Monkey = {
  items: number[];
  op: Operation;
  divisor: number;
  next: [number, number];
  count: number;
};
type Input = Monkey[];

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n\n")
    .map((block) => {
      const lines = block.split("\n", 6);

      const items = lines[1]
        .split(": ", 2)[1]
        .split(",")
        .map((value) => parseInt(value));

      const op = lines[2]
        .split(": ", 2)[1]
        .split(" = old ", 2)[1]
        .split(" ", 2)
        .map((v, i) => (i === 0 ? v : v === "old" ? "old" : parseInt(v)));

      const divisor = parseInt(lines[3].split(": divisible by", 2)[1]);

      const next = [
        parseInt(lines[4].split("throw to monkey ", 2)[1]),
        parseInt(lines[5].split("throw to monkey ", 2)[1]),
      ];

      return { items, op, divisor, next, count: 0 } as Monkey;
    });

const runRound = (monkeys: Input, product?: number) => {
  for (let m = 0; m < monkeys.length; m++) {
    const { items, op, divisor, next } = monkeys[m]!;
    for (let i = 0; i < items.length; i++) {
      if (product) {
        // part 2
        items[i] = evalOp(items[i]! % product, op);
      } else {
        // part 1
        items[i] = Math.floor(evalOp(items[i]!, op) / 3);
      }
      const nextMonkey = items[i]! % divisor === 0 ? next[0] : next[1];
      monkeys[nextMonkey]!.items.push(items[i]!);
    }
    monkeys[m]!.count += items.length;
    items.splice(0, items.length);
  }
};

const evalOp = (level: number, op: Operation) => {
  const [operand, value] = op;
  const resolved = value === "old" ? level : value;
  switch (operand) {
    case "+":
      return level + resolved;
    case "*":
      return level * resolved;
  }
};

export const solvePartOne = (input: string) => {
  const monkeys = parseInput(input);
  for (let round = 1; round <= 20; round++) {
    runRound(monkeys);
  }
  const [first, second] = monkeys.map(({ count }) => count).sort(asc);
  return first! * second!;
};

export const solvePartTwo = (input: string) => {
  const monkeys = parseInput(input);
  const divisor = monkeys.map(({ divisor }) => divisor).reduce(product, 1);
  for (let round = 1; round <= 10_000; round++) {
    runRound(monkeys, divisor);
  }
  const counts = monkeys.map(({ count }) => count);
  const [first, second] = counts.sort(asc);
  return first! * second!;
};

// helpers

const asc = (a: number, b: number) => b - a;
const product = (a: number, b: number) => a * b;

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(10_605);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(2_713_310_158);
  });
}
