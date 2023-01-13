import { readFile as fsReadFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const readFile = async (type: "input" | "example", number: number) => {
  const day = String(number).padStart(2, "0");
  const file = await fsReadFile(resolve(__dirname, `./${day}/${day}.${type}.txt`));
  return file.toString("utf-8");
};
