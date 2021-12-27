import yahooFinance from "yahoo-finance2";
import Symbol from "./models/symbol.js";
import fetch from "node-fetch";

//const result = await yahooFinance.quote("BBDC4.SA");

export default async (req, res) => {
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

const auth =
  "eyIkdHlwZSI6IlN5c3RlbS5JZGVudGl0eU1vZGVsLlRva2Vucy5Kd3QuSnd0SGVhZGVyLCBTeXN0ZW0uSWRlbnRpdHlNb2RlbC5Ub2tlbnMuSnd0IiwiYWxnIjoiaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjaG1hYy1zaGEyNTYiLCJ0eXAiOiJKV1QifQ.eyIkdHlwZSI6IlN5c3RlbS5JZGVudGl0eU1vZGVsLlRva2Vucy5Kd3QuSnd0UGF5bG9hZCwgU3lzdGVtLklkZW50aXR5TW9kZWwuVG9rZW5zLkp3dCIsIm5hbWVpZCI6IkdsYXVjbyIsInJvbGUiOiJBY3RpdmF0ZWQiLCJQZXJzb25UeXBlIjoiSW5kaXZpZHVhbEN1c3RvbWVyIiwiVXNlcklEIjoiNzY1NjA3IiwiU2Vzc2lvbklEIjoiM2YzZjQ0ZGYtZDU1NC00MzAyLTg0ZDctMjUyOTQxZmViZTNlIiwiVXNlcklQIjoiMTcyLjExNS4xODUuMjA1IiwiQXBwbGljYXRpb25JRCI6IjE4IiwiMDUwOGEyODI3OTJiIjoiK1BlWi9ZL3JLV1ZFUllzM1lobytqZkovWFpGNFZCd003N3VjKzQwNnZFVWNsbUo2QVJ5MEYwaUYvQkQ3UVpUMXZ4dlliWitCOEo2T0FKeHJTVkJBNXc9PSIsIklzTW9iaWxlIjoiRmFsc2UiLCJDQkxDIjoiMzQyNTMwIiwiSXNGaXJzdEFjdGl2YXRlZExvZ2luIjoiRmFsc2UiLCJuYmYiOjE2NDA1MDA4NDUsImV4cCI6MTY0MDU0NDA0NSwiaXNzIjoiaHR0cHM6Ly93ZWJhcGllcXIudG9yb2ludmVzdGltZW50b3MuY29tLmJyLyIsImF1ZCI6Ikh1YiJ9.9Kz8kX-YPayTYgMyQ7PMENP89lhaqHzMeblOVHjdn2I";
