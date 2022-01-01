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

const chart = async (req, res) => {
  let result;
  try {
    const query = "NUBR33.SA";
    const queryOptions = { period1: "2021-12-20" /* ... */ };
    result = await yahooFinance.historical(query, queryOptions);
  } catch (e) {
    result = e.result;
  }
  res.send(result);
  return;
};

const getCurrentPrice = async (req, res) => {
  const { symbol } = req.body;

  try {
    /* const data = await yahooFinance.quoteCombine(`${symbol}.SA`, {
      fields: [
        "regularMarketPrice",
        "regularMarketPreviousClose",
        "regularMarketChangePercent",
      ],
    });

    const {
      regularMarketPrice,
      regularMarketPreviousClose,
      regularMarketChangePercent,
    } = data;
    console.log(data); */
    res.send(
      JSON.stringify({
        currentPrice: 22,
        previousPrice: 20,
        priceChangePercent: 10,
      })
    );
    return;
  } catch (e) {
    console.log(e);
    res.send("0");
    return;
  }
};
export default getCurrentPrice;
