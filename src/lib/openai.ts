import OpenAI from "openai";

// Get apiKey.
const apiKey = process.env.OPEN_API_KEY;

// creating OpenAI instance.
export const openai = new OpenAI({
  apiKey: apiKey,
});
