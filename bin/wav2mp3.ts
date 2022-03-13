import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const INPUT_SAMPLES_PATH = "./bin/samples";
const OUTPUT_SAMPLES_PATH = "./public/samples";

// get samples
const filenames: string[] = fs.readdirSync(INPUT_SAMPLES_PATH);

filenames.forEach((filename: string) => {
  if (filename.indexOf(".wav") > -1) {
    const file: string = filename.split(".wav")[0];
    const input: string = `${INPUT_SAMPLES_PATH}/${filename}`;
    const output: string = `${OUTPUT_SAMPLES_PATH}/${file}.mp3`;
    ffmpeg(input)
      .toFormat("mp3")
      .on("end", () => {
        console.log(`converted: ${output}`);

        // remove input file
        fs.unlink(input, (err) => {
          if (err) throw err;
        });
      })
      .save(output);
  }
});
