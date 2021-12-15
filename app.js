const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/auth");

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
  })
);

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.pwa2d.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
    console.log(`MongoDB connected and server listening on port ${PORT}`);
  })
  .catch(console.log);
