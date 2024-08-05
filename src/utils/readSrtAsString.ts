import fs from "fs";

export const readSrtFileAsString = (inputPath: string): string => {
  try {
    // Lendo o arquivo SRT como uma string
    const srtContent = fs.readFileSync(inputPath, "utf8");
    return srtContent;
  } catch (error) {
    console.error("Error reading the file:", error);
    throw error;
  }
};
