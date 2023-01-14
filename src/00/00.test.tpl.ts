import { readFile } from "src/helpers";
import { expect, test } from "vitest";
import { solvePartOne, solvePartTwo } from "./00";

const input = await readFile("example", 0);

test("part one", () => {
  expect(solvePartOne(input)).toEqual(null);
});
test("part two", () => {
  expect(solvePartTwo(input)).toEqual(null);
});
