import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string(),
  videoUrl: z.string().url().optional(),
  audioPath: z.string(),
  subtitles: z
    .array(
      z.object({
        content: z.string(),
        language: z.string(),
      })
    )
    .optional(),
  summary: z
    .array(
      z.object({
        content: z.string(),
        language: z.string(),
      })
    )
    .optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
});

export const subtitleSchema = z.object({
  resourceId: z.string(),
  subtitles: z.array(
    z.object({
      content: z.string(),
      language: z.string(),
    })
  ),
});
