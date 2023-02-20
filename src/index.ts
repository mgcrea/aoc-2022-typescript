import { readdir } from "node:fs/promises";
import { parse } from "node:path";
import { hrtime } from "node:process";
import { readFile } from "./helpers";

const files = (await readdir("./src/bin", { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map(({ name }) => parse(name).name);

const ROUNDS = process.env["ROUNDS"] ? Number(process.env["ROUNDS"]) : 1;
const DAY = process.env["DAY"] ? Number(process.env["DAY"]) : undefined;
const PART = process.env["PART"] ? Number(process.env["PART"]) : undefined;

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
  console.log(result, `(elapsed: ${humanizeTime(number)})`);
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
  console.log(result, `(elapsed: ~${humanizeTime(number / rounds)} for ${rounds} rounds)`);
};
const humanizeTime = (time: number) => {
  if (time > 1e6) {
    return `${(time / 1e6).toFixed(2)}s`;
  }
  if (time > 1e3) {
    return `${(time / 1e3).toFixed(2)}ms`;
  }
  return `${time.toFixed(2)}µs`;
};

// console.dir({ files });
for (const date of files) {
  const day = Number(date);
  if (DAY && DAY !== day) {
    continue;
  }
  try {
    const input = await readFile("input", day);
    const code = await import(`./bin/${date}`);
    console.log(`----------\n| Day ${date} |\n----------`);
    if (code.solvePartOne && PART !== 2) {
      console.log(`🎄 Part 1 🎄`);
      run(code.solvePartOne, input);
    }
    if (code.solvePartTwo && PART !== 1) {
      console.log(`🎄 Part 2 🎄`);
      run(code.solvePartTwo, input);
    }
  } catch (err) {
    console.error(err);
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
