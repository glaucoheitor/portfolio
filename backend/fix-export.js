import { promises as fs } from "fs";
import { resolve } from "path";
import { exit } from "process";
import replace from "replace-in-file";

const base = "./frontend/src/assets/theme/";

let files = [];

for await (const f of getFiles(base)) {
  files.push(f);
}

for (const file of files) {
  const fileName = file.split("/").pop().split(".")[0];
  let folder = file.split("/");
  folder = folder[folder.length - 2];

  if (!fileName) continue;
  console.log(fileName);
  try {
    const results = await replace({
      files: file,
      from: "export default {",
      to: `const ${fileName === "index" ? folder : fileName} = {`,
    });
    console.log("Replacement results:", results);
    if (results[0].hasChanged)
      await fs.appendFile(
        file,
        `export default ${fileName === "index" ? folder : fileName};`
      );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
