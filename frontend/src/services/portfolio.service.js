import yahooFinance from "yahoo-finance2";

export const buildPortfolioFromTrades = (trades) => {
  let portfolio = {};
  let s;
  for (const trade of trades) {
    s = trade.symbol._id;
    if (!portfolio.hasOwnProperty(s)) {
      portfolio[s] = {
        symbol: trade.symbol.symbol,
        companyName: trade.symbol.companyName
          ? trade.symbol.companyName.longName
            ? trade.symbol.companyName.longName
            : trade.symbol.companyName.shortName
          : trade.symbol.symbol,
        total: 0,
        totalQty: 0,
        precoMedio: 0,
        currentPrice: null,
        previousPrice: null,
      };
    }
    if (trade.type === "C") {
      portfolio[s].total += Number(trade.qty) * Number(trade.price);
      portfolio[s].totalQty += Number(trade.qty);
      portfolio[s].precoMedio = portfolio[s].total / portfolio[s].totalQty;
    } else if (trade.type === "V") {
      portfolio[s].total -= Number(trade.qty) * portfolio[s].precoMedio;
      portfolio[s].totalQty -= Number(trade.qty);
    }
  }
  return sortAndReducePortfolio(portfolio);
};

export const getCurrentPrice = async (symbol) => {
  try {
    const data = await fetch("http://localhost:3001/test", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol }),
    }).then((res) => res.json());

    return data;
    /* const { regularMarketPrice } = await yahooFinance.quoteCombine(
      `${symbolName}.SA`,
      { fields: ["regularMarketPrice"] }
    );
    return regularMarketPrice; */
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const sortAndReducePortfolio = (trades) => {
  return Object.entries(trades)
    .sort(([, a], [, b]) => {
      if (a.symbol > b.symbol) {
        return 1;
      }
      if (a.symbol < b.symbol) {
        return -1;
      }
      return 0;
    })
    .reduce((obj, [symbolId, data]) => {
      if (data.totalQty > 0) {
        obj[symbolId] = trades[symbolId];
      }
      return obj;
    }, {});
};
