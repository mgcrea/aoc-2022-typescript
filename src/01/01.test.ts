import { readFile } from "fs/promises";
import { resolve } from "path";
import { expect, test } from "vitest";
import { solvePartOne, solvePartTwo } from "./01";

const input = await (await readFile(resolve(__dirname, "./01.example.txt"))).toString("utf-8");
test("part one", () => {
  expect(solvePartOne(input)).toEqual(24000);
});
test("part two", () => {
  expect(solvePartTwo(input)).toEqual(45000);
});
