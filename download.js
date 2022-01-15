import client from "https";
import fs from "fs";

import Symbol from "./models/symbol.js";

const download = async (req, res) => {
  const symbolsDB = await Symbol.find({});
  const symbols = symbolsDB
    .map((s) => s._doc.symbol)
    .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

  const response = await Promise.all(
    symbols.map((symbol) =>
      downloadImage(
        `https://cdn.toroinvestimentos.com.br/corretora/images/quote/${symbol.slice(
          0,
          4
        )}.svg`,
        `./frontend/src/assets/images/logos/stocks/${symbol.slice(0, 4)}.svg`
      )
    )
  );

  res.send(JSON.stringify(response));
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  }).catch((e) => e);
}

export default download;
