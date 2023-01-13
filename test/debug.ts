import { inspect as baseInspect } from "util";

const inspect = (unknown: unknown) =>
  baseInspect(unknown, {
    colors: true,
    depth: 20,
  });

declare global {
  // eslint-disable-next-line no-var
  var d: (...args: unknown[]) => void;
}

globalThis.d = (...args: unknown[]) => {
  const time = new Date().toISOString();
  const output = inspect(args.length === 1 ? args[0] : args);
  // console.warn(`🚨 ${chalk.white.bgRed(time)} - ${chalk.red("break")}: ${inspected}`);
  console.warn(`\n${time} - ${output}`);
};
