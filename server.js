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
import { ibov, historical } from "./services/yahooFinance.js";

const app = express();

const { PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;

app.use(cors({ origin: "https://stocks.glaucoheitor.com" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://stocks.glaucoheitor.com"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use(isAuth);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: process.env.NODE_ENV !== "production",
    customFormatErrorFn: (err) => ({ type: err.message }),
  })
);

app.use("/getCurrentPrices", getCurrentPrices);
app.use("/insertTrades", insertTradesFromOldDB);
app.use("/download", download);
app.use("/ibov", ibov);
app.use("/historical", historical);

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.pwa2d.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
    console.log(`MongoDB connected and server listening on port ${PORT}`);
  })
  .catch(console.log);
