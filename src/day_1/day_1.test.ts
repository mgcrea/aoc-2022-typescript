import { describe, expect, test } from "vitest";
import { solve, solveExtra } from "./day_1";
import { input } from "./day_1.fixture";

describe("day_1", () => {
  test("solve", () => {
    expect(solve(input)).toMatchInlineSnapshot("70116");
  });
  test("solveExtra", () => {
    expect(solveExtra(input)).toMatchInlineSnapshot("206582");
  });
});
