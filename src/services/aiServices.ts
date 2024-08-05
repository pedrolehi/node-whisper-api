import { openai } from "../lib/openai";
import fs from "fs";

export const getTranscription = async (
  filePath: string,
  context: string
): Promise<string> => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "srt",
      prompt: context,
    });

    console.log("Transcription response:", transcription);

    // A verificação adicional pode ser redundante, mas garante que estamos lidando com uma string
    if (typeof transcription !== "string") {
      throw new Error("Invalid transcription response. Expected a string.");
    }

    return transcription;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
};

export const saveTranscription = async (
  transcription: string,
  outputPath: string
) => {
  fs.writeFile(outputPath, transcription, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log("file saved sucessfully.");
    }
  });
};

export const getTranslation = async (input: string, lang: string) => {
  try {
    const translation = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Translate this srt file ${input} to this language ${lang} add no comensts and return only the content that is on the file given.`,
        },
      ],
      model: "gpt-4o-mini",
    });

    console.log(translation.choices[0]);
    return translation.choices[0].message.content;
  } catch (error) {
    console.error("Error during translation:", error);
    throw error;
  }
};

export const getSummary = async (input: string, lang: string) => {
  try {
    const translation = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Take this srt file ${input} and give me a summary to the content to the following language ${lang} giving me the main topics and shor descriptions of it. Do not comment, only give the summary.`,
        },
      ],
      model: "gpt-4o-mini",
    });

    console.log(translation.choices[0]);
    return translation.choices[0].message.content;
  } catch (error) {
    console.error("Error during translation:", error);
    throw error;
  }
};
