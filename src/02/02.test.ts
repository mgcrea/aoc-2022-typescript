import { readFile } from "src/helpers";
import { expect, test } from "vitest";
import { solvePartOne, solvePartTwo } from "./02";

const input = await readFile("example", 2);

test("part one", () => {
  expect(solvePartOne(input)).toEqual(15);
});
test("part two", () => {
  expect(solvePartTwo(input)).toEqual(12);
});
