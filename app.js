import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";

import mongoose from "mongoose";

import graphQlSchema from "./graphql/schema/index.js";
import graphQlResolvers from "./graphql/resolvers/index.js";
import isAuth from "./middleware/auth.js";

import getCurrentPrices from "./getCurrentPrices.js";
import insertTradesFromOldDB from "./insertTradesFromOldDB.js";
import download from "./download.js";

const app = express();

const { PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;

app.use(cors());

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    customFormatErrorFn: (err) => ({ type: err.message }),
  })
);

app.use("/getCurrentPrices", getCurrentPrices);
app.use("/insertTrades", insertTradesFromOldDB);
app.use("/download", download);

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.pwa2d.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
    console.log(`MongoDB connected and server listening on port ${PORT}`);
  })
  .catch(console.log);
