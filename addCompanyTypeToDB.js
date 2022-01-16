import Symbol from "./models/symbol.js";
import * as fs from "fs/promises";
import mongoose from "mongoose";

const MONGO_DB = "stocks";
const MONGO_USER = "glauco";
const MONGO_PASSWORD = "wFBWBc2EfoaH8B8p";
const FILE_LOCATION = "./test.json";

const add = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.pwa2d.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log(`MongoDB connected`);
    })
    .catch(console.log);

  const symbols = await Symbol.find({});

  const dataReturn = symbols
    .map(({ _id, companyName }) => {
      if (typeof companyName === "object") {
        const name = companyName.longName
          ? companyName.longName
          : companyName.shortName;

        return {
          updateOne: {
            filter: { _id },
            update: {
              companyName: name ? name.trim() : "",
            },
          },
        };
      }
    })
    .filter((v) => v);
  //const dbResult = await Symbol.bulkWrite(dataReturn);
  console.log(dataReturn);
};

add();
