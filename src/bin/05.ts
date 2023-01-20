const DAY = 5;

type Stack = number[];
type Move = [number, number, number];
type Input = [Stack[], Move[]];

const parseInput = (input: string, safe?: boolean): Input => {
  const [stacks, moves] = input.split("\n\n");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [parseStacksInput(stacks!, safe), parseMovesInputs(moves!, safe)];
};

const parseStacksInput = (input: string, safe?: boolean): Stack[] => {
  const [columns, ...stacksInput] = input.split("\n").reverse();
  const size = columns?.trim().split(/\s+/).length;
  const stacks = new Array(size).fill(null).map(() => [] as Stack);
  return stacksInput
    .filter((line) => (safe ? /(\[[A-Z]\]|\s{3})/.test(line) : Boolean))
    .reduce((soFar, stackInput) => {
      soFar.forEach((stack, index) => {
        const charIndex = index * 4 + 1;
        const char = stackInput.slice(charIndex, charIndex + 1);
        if (char !== " " && char !== "") {
          stack.push(char.charCodeAt(0) - 65);
        }
      });
      return soFar;
    }, stacks);
};

const parseMovesInputs = (input: string, safe?: boolean): Move[] =>
  input
    .trim()
    .split("\n")
    .filter((line) => (safe ? /^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/.test(line) : Boolean))
    .map((line) => line.split(" "))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((array) => [parseInt(array[1]!), parseInt(array[3]!) - 1, parseInt(array[5]!) - 1]);

export const executeMove = (stacks: Stack[], move: Move, multiple?: boolean) => {
  const [count, from, to] = move;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fromStack = stacks[from]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const toStack = stacks[to]!;
  const items = fromStack.splice(fromStack.length - count);
  toStack.push(...(multiple ? items : items.reverse()));
};

const getTopOfStacksAsString = (stacks: Stack[]) =>
  stacks
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((stack) => (stack.length ? String.fromCharCode(stack.pop()! + 65) : ""))
    .join("");

export const solvePartOne = (input: string) => {
  const [stacks, moves] = parseInput(input);
  moves.forEach((move) => executeMove(stacks, move));
  return getTopOfStacksAsString(stacks);
};

export const solvePartTwo = (input: string) => {
  const [stacks, moves] = parseInput(input);
  moves.forEach((move) => executeMove(stacks, move, true));
  return getTopOfStacksAsString(stacks);
};

// helpers

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual("CMZ");
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual("MCD");
  });
}
