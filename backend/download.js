import client from "https";
import fs from "fs";

import Symbol from "./models/symbol.js";

const download = async (req, res) => {
  const symbolsDB = await Symbol.find({});
  const symbols = symbolsDB
    .map((s) => {
      if (
        fs.existsSync(
          `./frontend/src/assets/images/logos/stocks/${s._doc.symbol.slice(
            0,
            4
          )}.svg`
        )
      ) {
        return null;
      }
      return s._doc.symbol;
    })
    .filter((s) => s)
    .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

  const response = await Promise.all(
    symbols.map((symbol) => {
      console.log(symbol, typeof symbol);
      return downloadImage(
        `https://www.ivalor.com.br/media/emp/logos/${symbol.slice(0, 4)}.png`,
        `./frontend/src/assets/images/logos/stocks/png/${symbol.slice(
          0,
          4
        )}.png`
      );
    })
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
