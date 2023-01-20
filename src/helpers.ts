import { readFile as fsReadFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { inspect as baseInspect } from "util";

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
    depth: 20,
  });

globalThis.d = (...args: unknown[]): void => {
  const time = new Date().toISOString();
  const output = inspect(args.length === 1 ? args[0] : args);
  // console.warn(`🚨 ${chalk.white.bgRed(time)} - ${chalk.red("break")}: ${inspected}`);
  console.warn(`\n${time} - ${output}`);
};

globalThis.i = <T>(value: T, index: number): T => {
  d({ [index]: value });
  return value;
};

declare global {
  /* eslint-disable no-var */
  var d: (...args: unknown[]) => void;
  var i: <T>(value: T, index: number) => T;
}
