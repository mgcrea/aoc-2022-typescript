import { readFile } from "src/helpers";
import { expect, test } from "vitest";
import { solvePartOne, solvePartTwo } from "./01";

const input = await readFile("example", 1);

test("part one", () => {
  expect(solvePartOne(input)).toEqual(24000);
});
test("part two", () => {
  expect(solvePartTwo(input)).toEqual(45000);
});
