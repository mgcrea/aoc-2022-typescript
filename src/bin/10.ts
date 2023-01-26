const DAY = 10;

type Instruction = ["addx", number] | ["noop", null];
type Input = Instruction[];

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n")
    .map((line) => {
      const [op, val] = split_once(line, " ");
      return [op, val ? parseInt(val) : null] as Instruction;
    });

type Computer = {
  clock: number;
  register: number;
  interrupts: Map<number, Instruction[]>;
  history: number[];
};

const cpu: Computer = {
  clock: 1,
  register: 1,
  interrupts: new Map(),
  history: [1],
};

const interrupt = (cycle: number, ins: Instruction) => {
  if (cpu.interrupts.has(cycle)) {
    const stack = cpu.interrupts.get(cycle)!;
    stack.push(ins);
  } else {
    cpu.interrupts.set(cycle, [ins]);
  }
};

const execute = ([op, val]: Instruction) => {
  // d([cpu.clock, `X=${cpu.register}`, op, val]);
  cpu.history[cpu.clock] = cpu.register;
  switch (op) {
    case "addx":
      interrupt(cpu.clock + 2, [op, val]);
      cpu.clock++;
      execute(["noop", null]);
      return;
    case "noop":
      cpu.clock++;
      break;
    default:
      break;
  }
  const interrupts = cpu.interrupts.get(cpu.clock);
  if (interrupts) {
    interrupts.forEach(process);
  }
};

const process = ([op, val]: Instruction) => {
  switch (op) {
    case "addx":
      // d(`!addx+${val}`);
      cpu.register += val;
      break;
    case "noop":
      break;
    default:
      break;
  }
};

export const solvePartOne = (input: string) => {
  const parsedInput = parseInput(input);
  parsedInput.forEach(execute);
  const cycles = [20, 60, 100, 140, 180, 220];
  const signals = cycles.map((cycle) => cycle * cpu.history[cycle]!);
  const total = sum(signals);
  return total;
};
export const solvePartTwo = (input: string) => {
  const parsedInput = parseInput(input);
  parsedInput.forEach(execute);
  const screen: ("." | "#")[] = [];
  for (let cycle = 0; cycle < 240; cycle++) {
    const y = cycle % 40;
    const x = cpu.history[cycle + 1]!;
    screen[cycle] = Math.abs(x - y) <= 1 ? "#" : ".";
  }
  let buffer = "";
  for (let row = 0; row <= screen.length - 40; row += 40) {
    buffer += screen.slice(row, row + 40).join("");
    buffer += "\n";
  }
  return buffer;
};

// helpers

const split_once = (string: string, separator: string): [string, string] => {
  const index = string.indexOf(separator);
  return index !== -1 ? [string.slice(0, index), string.slice(index + 1)] : [string, ""];
};
const sum = (array: number[]): number => array.reduce((a, b) => a + b);

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(13140);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toMatchInlineSnapshot(`
      "##..##..##..##..##..##..##..##..##..##..
      ###...###...###...###...###...###...###.
      ####....####....####....####....####....
      #####.....#####.....#####.....#####.....
      ######......######......######......####
      #######.......#######.......#######.....
      "
    `);
  });
}
