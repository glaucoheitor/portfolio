const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            trades: [String!]!
        }

        type RootMutation {
            addTrade(type: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      trades: () => {
        return ["C", "C", "V"];
      },
      addTrade: (args) => {
        const tradeType = args.type;
        return tradeType;
      },
    },
    graphiql: true,
  })
);

app.listen(3001);
