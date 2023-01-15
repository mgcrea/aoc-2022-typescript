import { readFile } from "src/helpers";
import { expect, test } from "vitest";
import { solvePartOne, solvePartTwo } from "./03";

const input = await readFile("example", 3);

test("part one", () => {
  expect(solvePartOne(input)).toEqual(157);
});
test.only("part two", () => {
  expect(solvePartTwo(input)).toEqual(70);
});
