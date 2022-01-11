import * as fs from "fs/promises";

const files = await fs.readdir("./json/");

console.log(files);

for (const file of files) {
  const json = await fs
    .readFile(`./json/${file}`)
    .then((file) => JSON.parse(file));

  await fs.writeFile(
    `./json/${file}`,
    JSON.stringify(json.map((j) => j[0]).filter((a) => a))
  );
}
