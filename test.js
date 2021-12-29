import yahooFinance from "yahoo-finance2";
import Symbol from "./models/symbol.js";
import fetch from "node-fetch";

//const result = await yahooFinance.quote("BBDC4.SA");

export const test = async (req, res) => {
  const symbols = await Symbol.find({});
  let bulk = await Promise.all(
    symbols.map(async (s) => {
      try {
        const data = await fetch(
          `https://statusinvest.com.br/home/mainsearchquery?q=${s.symbol}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //authorization: "Bearer " + auth,
            },
          }
        ).then((res) => res.json());
        const dataReturn = {
          symbolId: s._id,
          symbol: s.symbol,
          companyName: data[0].name,
        };
        console.log(dataReturn);
        return dataReturn;
      } catch (e) {
        return;
      }
    })
  ).then((arr) => arr.filter((obj) => obj));
  console.log(bulk);

  //const r = await Symbol.bulkWrite(bulk);
  res.send(bulk);
  return;
};

export default async (req, res) => {
  const query = "AAPL";
  const queryOptions = { period1: "2021-05-08", return: "object" /* ... */ };
  const result = await yahooFinance._chart(query, queryOptions);
  res.send(result);
  return;
};
