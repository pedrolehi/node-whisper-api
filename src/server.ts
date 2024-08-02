import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import {
  convertMp3,
  downloadAudio,
  outputPath,
} from "./services/audioServices";
import { getTranscription, saveTranscription } from "./services/aiServices";
import { srtToString } from "./utils/srtToJsonParser";

const server = Fastify({
  logger: true,
});

server.register(cors);

// Schemas

const querySchema = z.object({ v: z.string() });

server.get("/audio", async (request: FastifyRequest, reply: FastifyReply) => {
  const validationResult = querySchema.safeParse(request.query);

  if (!validationResult.success) {
    return reply.status(400).send({ error: validationResult.error.errors });
  }

  const videoId = validationResult.data.v;

  try {
    await downloadAudio(videoId);
    await convertMp3();

    const context =
      "This is a video tutorial on how to create an srt generator for youtube videos using whisper ai.";

    const transcription = await getTranscription(
      "assets/audio/audio.mp3",
      context
    );

    await saveTranscription(transcription, "assets/srt/audio.srt");

    return reply.send({ message: "Transcription completed and saved." });
  } catch (error: any) {
    console.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

const port = 3000;

server.listen({ port: port }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});

srtToString("assets/srt/audio.srt");
