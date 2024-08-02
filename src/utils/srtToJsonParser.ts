import fs from "fs";
import { parseSync } from "subtitle";

export const srtToString = (inputPath: string) => {
  const input = fs.readFileSync(inputPath);

  const subtitle = parseSync(input.toString("utf8"));

  console.log(JSON.stringify(subtitle, null, 2));
};
