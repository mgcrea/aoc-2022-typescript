import { readdir } from "fs/promises";
import { readFile } from "./helpers";

const folders = (await readdir("./src", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => name)
  .slice(1);

for (const date of folders) {
  const day = parseInt(date);
  const input = await readFile("input", day);
  const code = await import(`./${date}/${date}`);
  console.log(`----------\n| Day ${date} |\n----------`);
  console.log(`🎄 Part 1 🎄`);
  console.log(code.solvePartOne(input));
  console.log(`🎄 Part 2 🎄`);
  console.log(code.solvePartTwo(input));
}
