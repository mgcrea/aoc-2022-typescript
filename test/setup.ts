import { inspect as baseInspect } from "util";
declare global {
  interface ImportMeta {
    vitest: boolean;
  }
}

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
