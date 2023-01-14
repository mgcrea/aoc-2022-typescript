import { readFile as fsReadFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const readFile = async (type: "input" | "example", day: number) => {
  const date = String(day).padStart(2, "0");
  const file = await fsReadFile(resolve(__dirname, `./${date}/${date}.${type}.txt`));
  return file.toString("utf-8");
};
