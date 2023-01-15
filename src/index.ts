import { readdir } from "fs/promises";
import { hrtime } from "node:process";
import "./../test/setup";
import { readFile } from "./helpers";

const folders = (await readdir("./src", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => name);

const ROUNDS = process.env["ROUNDS"] ? Number(process.env["ROUNDS"]) : 1;
const DAY = process.env["DAY"] ? Number(process.env["DAY"]) : undefined;

const run = <T extends unknown[], U>(fn: (...args: T) => U, ...args: T): void => {
  ROUNDS > 1 ? logBench(...bench(fn, ROUNDS, ...args)) : logPerf(...perf(fn, ...args));
};

const perf = <T extends unknown[], U>(fn: (...args: T) => U, ...args: T): [U, number] => {
  const start = hrtime.bigint();
  const result = fn(...args);
  const end = hrtime.bigint();
  return [result, Number(end - start) / 1000];
};
const logPerf = (result: unknown, number: number) => {
  console.log(result, `(elapsed: ${number.toFixed(2)}µs)`);
};

const bench = <T extends unknown[], U>(
  fn: (...args: T) => U,
  rounds: number,
  ...args: T
): [U, number, number] => {
  const start = hrtime.bigint();
  for (let i = 0; i < rounds; i++) {
    fn(...args);
  }
  const result = fn(...args);
  const end = hrtime.bigint();
  return [result, Number(end - start) / 1000, rounds];
};
const logBench = (result: unknown, number: number, rounds: number) => {
  console.log(result, `(elapsed: ~${(number / rounds).toFixed(2)}µs for ${rounds} rounds)`);
};

for (const date of folders) {
  const day = Number(date);
  if (DAY && DAY !== day) {
    continue;
  }
  const input = await readFile("input", day);
  const code = await import(`./${date}/${date}`);
  console.log(`----------\n| Day ${date} |\n----------`);
  if (code.solvePartOne) {
    console.log(`🎄 Part 1 🎄`);
    run(code.solvePartOne, input);
  }
  if (code.solvePartTwo) {
    console.log(`🎄 Part 2 🎄`);
    run(code.solvePartTwo, input);
  }
}

// const codeFileTemplate = (day: number) => {
//   const date = String(day).padStart(2, "0");
//   return `// day ${date}

// export const solvePartOne = (input: string) => {
//   return null;
// };

// export const solvePartTwo = (input: string) => {
//   return null;
// };
// `;
// };

// const testFileTemplate = (day: number) => {
//   const date = String(day).padStart(2, "0");
//   return `// day ${date}

// import { readFile } from "src/helpers";
// import { expect, test } from "vitest";
// import { solvePartOne, solvePartTwo } from "./${date}";

// const input = await readFile("example", ${day});

// test("part one", () => {
//   expect(solvePartOne(input)).toEqual(null);
// });
// test("part two", () => {
//   expect(solvePartTwo(input)).toEqual(null);
// });
//   `;
// };
