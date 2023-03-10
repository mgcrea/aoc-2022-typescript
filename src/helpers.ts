import { fsyncSync, writeFileSync, writeSync } from "node:fs";
import { readFile as fsReadFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inspect as baseInspect } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const readFile = async (type: "input" | "example", day: number) => {
  const date = String(day).padStart(2, "0");
  const file = await fsReadFile(resolve(__dirname, `./${type}s/${date}.txt`));
  return file.toString("utf-8");
};

// debug tools

const inspect = (unknown: unknown) =>
  baseInspect(unknown, {
    colors: true,
    depth: 4,
  });

globalThis.p = (s: string) => {
  writeSync(1, `\n${s}`);
  fsyncSync(1);
};

globalThis.d = (...args: unknown[]): void => {
  const time = new Date().toISOString();
  const output = inspect(args.length === 1 ? args[0] : args);
  // console.warn(`🚨 ${chalk.white.bgRed(time)} - ${chalk.red("break")}: ${inspected}`);
  p(`${time} - ${output}`);
};

globalThis.i = <T>(value: T, index: number): T => {
  d({ [index]: value });
  return value;
};

globalThis.f = (value: string) => writeFileSync(`./file.txt`, value);

globalThis.IS_TEST = process.env["NODE_ENV"] === "test";

declare global {
  /* eslint-disable no-var */
  var d: (...args: unknown[]) => void;
  var i: <T>(value: T, index: number) => T;
  var p: (s: string) => void;
  var f: (s: string) => void;
  var IS_TEST: boolean;
}

// types

export type Tuple<T, N extends number, A extends unknown[] = []> = A extends { length: N }
  ? A
  : Tuple<T, N, [...A, T]>;
declare global {
  interface String {
    split<N extends number | undefined>(
      splitter: string,
      limit?: N
    ): N extends number ? Tuple<string, N> : string[];
  }
}
