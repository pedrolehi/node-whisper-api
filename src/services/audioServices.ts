import ytdl from "@distube/ytdl-core";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

export const inputPath = "assets/audio/audio.mp4";
export const outputPath = "assets/audio/audio.mp3";

export const downloadAudio = async (videoId: string): Promise<void> => {
  const videoURL = `https://youtube.com/watch?v=${videoId}`;
  console.log("[START_DOWNLOAD]", videoURL);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(inputPath);

    const stream = ytdl(videoURL, {
      quality: "lowestaudio",
      filter: "audioonly",
    });

    let downloadedBytes = 0;
    let totalBytes = 0;

    stream.on("response", (response) => {
      const contentLength = parseInt(
        response.headers["content-length"] || "0",
        10
      );
      if (totalBytes === 0 && contentLength > 0) {
        totalBytes = contentLength;
        console.log(`[RESPONSE_RECEIVED] Total bytes: ${totalBytes}`);
      }
    });

    stream.on("data", (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes) {
        const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
        process.stdout.write(`\r[DOWNLOAD_PROGRESS] ${percent}%`);
      } else {
        console.log(`[PROGRESS_UNKNOWN] Downloaded bytes: ${downloadedBytes}`);
      }
    });

    stream.on("end", () => {
      console.log("\n[DOWNLOAD_COMPLETE]");
      resolve();
    });

    stream.on("error", (error) => {
      console.error("[ERROR_DOWNLOAD]", error);
      reject(new Error("[ERROR_DOWNLOADING_VIDEO]"));
    });

    writeStream.on("finish", () => {
      console.log("[FINISHED_WRITE_STREAM]");
      resolve();
    });

    writeStream.on("error", (error) => {
      console.error("[ERROR_WRITE_STREAM]", error);
      reject(new Error("[ERROR_WRITING_FILE]"));
    });

    stream.pipe(writeStream);
  });
};

export const convertMp3 = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se ffmpegStatic é nulo ou indefinido
    if (!ffmpegStatic) {
      return reject(new Error("FFmpeg static binary not found"));
    }

    // Tell fluent-ffmpeg where it can find FFmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Run FFmpeg
    ffmpeg()
      // Input file
      .input(inputPath)

      // Audio bit rate
      .outputOptions("-ab", "20k")

      // Output file
      .save(outputPath)

      // Log the percentage of work completed
      .on("progress", (progress) => {
        if (progress.percent) {
          process.stdout.write(
            `\r[CONVERSION_PROGRESS] ${Math.floor(progress.percent)}% done`
          );
        }
      })

      // The callback that is run when FFmpeg is finished
      .on("end", () => {
        console.log("\nAudio conversion finished.");
        // Delete the video.mp4 file after conversion
        fs.unlink(inputPath, (err) => {
          if (err) {
            console.error("[ERROR_DELETING_VIDEO]", err);
            reject(new Error("[ERROR_DELETING_VIDEO]"));
          } else {
            console.log("audio.mp4 has been deleted.");
            resolve();
          }
        });
      })

      // The callback that is run when FFmpeg encountered an error
      .on("error", (error) => {
        console.error("[ERROR_CONVERSION]", error);
        reject(new Error("[ERROR_CONVERTING_AUDIO]"));
      });
  });
};
