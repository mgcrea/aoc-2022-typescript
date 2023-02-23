import assert from "assert";

const DAY = 13;

type Packet = number | Packet[];
type List = Packet[];

type Input = [List, List][];
const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n\n")
    .map((block) => split_once(block, "\n").map((value) => JSON.parse(value) as List)) as Input;

export const solvePartOne = (input: string) => {
  const parsedInput = parseInput(input);
  return parsedInput.reduce((soFar, values, index) => {
    log(`== Pair ${index + 1} ==`);
    log(`- Compare ${JSON.stringify(values[0])} vs ${JSON.stringify(values[1])}`);
    const isOrdered = isOrderedPair(values[0], values[1]);
    return isOrdered ? soFar + index + 1 : soFar;
  }, 0);
};

const parseInputBis = (input: string): List[] =>
  input
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((value) => JSON.parse(value) as List);

export const solvePartTwo = (input: string) => {
  const DIVIDER_PACKETS = [[[2]], [[6]]];
  const parsedInput = parseInputBis(input).concat(structuredClone(DIVIDER_PACKETS));
  parsedInput.sort((a, b) => (isOrderedPair(a, b) ? -1 : 1));
  const firstDividerPacketIndex = parsedInput.findIndex(
    (value) => value.length === 1 && JSON.stringify(value).match(/^\[+2\]+$/)
  );
  const secondDividerPacketIndex = parsedInput.findIndex(
    (value) => value.length === 1 && JSON.stringify(value).match(/^\[+6\]+$/)
  );
  return (firstDividerPacketIndex + 1) * (secondDividerPacketIndex + 1);
};

const isOrderedPair = (leftList: List, rightList: List, path: number[] = [0]): boolean => {
  const left = get(leftList, path);
  const right = get(rightList, path);
  const pad = new Array(path.length * 2).fill(" ").join("");

  if (left === undefined && right === undefined) {
    // continue checking the next part of the input.
    const nextPath = path.slice(0, -1);
    nextPath[nextPath.length - 1]++;
    return isOrderedPair(leftList, rightList, nextPath);
  } else if (left === undefined) {
    log(`${pad}  - Left side ran out of items, so inputs are in the right order`);
    return true;
  } else if (right === undefined) {
    log(`${pad}  - Right side ran out of items, so inputs are not in the right order`);
    return false;
  }
  log(`${pad}- Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);

  // If *both values are integers*
  if (isNumber(left) && isNumber(right)) {
    if (left < right) {
      log(`${pad}  - Left side is smaller, so inputs are in the right order`);
      return true;
    } else if (left > right) {
      log(`${pad}  - Right side is smaller, so inputs are not in the right order`);
      return false;
    }
    // Continue checking the next part of the input
    path[path.length - 1]++;
    return isOrderedPair(leftList, rightList, path);
    // If *both values are lists*
  } else if (Array.isArray(left) && Array.isArray(right)) {
    return isOrderedPair(leftList, rightList, path.concat(0));
  } else if (isNumber(left)) {
    log(`${pad}  - Mixed types; convert left to [${left}] and retry comparison`);
    set(leftList, path, [left]);
    return isOrderedPair(leftList, rightList, path);
  } else {
    log(`${pad}  - Mixed types; convert right to [${right}] and retry comparison`);
    set(rightList, path, [right]);
    return isOrderedPair(leftList, rightList, path);
  }
};

// helpers

const get = (array: unknown, path: number[]) => {
  return path.reduce((soFar, index) => {
    return Array.isArray(soFar) ? soFar[index] : undefined;
  }, array);
};
const set = (array: unknown, path: number[], value: unknown) => {
  const parent = path.length > 1 ? get(array, path.slice(0, -1)) : array;
  assert(Array.isArray(parent));
  parent[path[path.length - 1]!] = value;
};
const log = (...args: unknown[]) => {
  if (process.env["NODE_ENV"] !== "test") {
    return;
  }
  console.log(...args);
};

const split_once = (string: string, separator: string): [string, string] => {
  const index = string.indexOf(separator);
  return index !== -1 ? [string.slice(0, index), string.slice(index + 1)] : [string, ""];
};

const isNumber = (maybeNumber: unknown): maybeNumber is number => typeof maybeNumber === "number";

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(13);
  });
  test.only(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(140);
  });
}
