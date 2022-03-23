import yahooFinance from "yahoo-finance2";
import Symbol from "./models/symbol.js";
import StockData from "./models/stockData.js";
import fetch from "node-fetch";
import * as fs from "fs/promises";

const FILE_LOCATION_ACOES = "C:/projects/portfolio/acoes.json";
const FILE_LOCATION_BDR = "C:/projects/bdr.json";
const FILE_LOCATION_ETF = "C:/projects/etf.json";
const FILE_LOCATION_ALL = "C:/projects/dataWithType.json";

export const newTest = async (req, res) => {
  const json = await fs
    .readFile(FILE_LOCATION_ALL)
    .then((file) => JSON.parse(file));

  res.send(
    json.map((s) => {
      if (s.type === "outro") return s;
    })
  );
  return;
  try {
    const data = await fetch(`https://statusinvest.com.br/acao/tickerprice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: "Bearer " + auth,
      },
      body: JSON.stringify({
        ticker: "CASH3",
        type: 4,
      }),
    }).then((res) => res.json());
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
};

export const test = async (req, res) => {
  //const symbols = await Symbol.find({});

  const data = await fs
    .readFile(FILE_LOCATION_ALL)
    .then((file) => JSON.parse(file));

  const dataReturn = data
    .map((d) => {
      const bulk = d.prices.map((p) => ({
        insertOne: {
          document: {
            date: p.date,
            close: p.price,
            symbol: d.symbolId,
          },
        },
      }));
      return bulk;
    })
    .flat();
  const dbResult = await StockData.bulkWrite(dataReturn);
  res.send(dbResult);
  return;
  let bulk = await Promise.all(
    symbols.map(async (s) => {
      if (acoes.find((stock) => s.symbol === stock.symbol)) return;
      console.log(s.symbol);
      /*       json.push(s);
      console.log(s);
      return s; */
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
        json.push({ symbol: s.symbol, data });
        /* if (data[0].prices.length > 0) {
          const dataReturn = {
            symbol: s.symbol,
            symbolId: s._id,
            prices: data[0].prices.map((p) => ({
              date: stringToDate(p.date.substring(0, 8)),
              price: p.price,
            })),
          };
          json.push(dataReturn);
          console.log(dataReturn);
          return dataReturn;
        } else {
          return;
        } */
      } catch (e) {
        console.log(e);
        return;
      }
    })
  ).then((data) => data.filter((d) => d));
  //await fs.writeFile(FILE_LOCATION_ETF, JSON.stringify(json));
  //const r = await Symbol.bulkWrite(bulk);
  res.send(json);
  return;
};

function stringToDate(dateString) {
  let dateArray = dateString.split("/");

  var formatedDate = `20${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  return new Date(formatedDate);
}

function formatType(i) {
  switch (i) {
    case 1:
      return "acao";
    case 2:
      return "fii";
    case 3:
      return "tesouro";
    case 4:
      return "bdr";
    case 6:
      return "etfs";
    case 12:
      return "aco";
    case 13:
      return "reits";
    case 15:
      return "fundos-de-investimento";
    case 901:
      return "etf/eua";
    default:
      return "outro";
  }
}

export default test;
