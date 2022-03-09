const URL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_LOCAL_BACKEND
    : process.env.REACT_APP_BACKEND;

export const getTrades = async (authData) => {
  try {
    const { data } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
              tradesByUserId(userId:"${authData.userId}") {
                type
                date
                qty
                price
                symbol {
                  _id
                  symbol
                  companyName
                }
              }
            }`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (await authData?.user?.auth?.currentUser?.getIdToken()),
      },
    }).then((res) => res.json());
    return data.tradesByUserId;
  } catch (e) {
    return [];
  }
};

export const getHistoricalStockData = async (
  authData,
  symbol,
  startDate,
  endDate
) => {
  try {
    const { data } = await fetch(`${URL}/historical?symbol=${symbol}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (await authData?.user?.auth?.currentUser?.getIdToken()),
      },
    }).then((res) => res.json());

    return data;
  } catch (e) {
    return [];
  }
};

export const getPositionAtDay = (symbolId, date, trades) => {
  const position = {
    total: 0,
    totalQty: 0,
    precoMedio: 0,
    priceAtDay: null,
  };
  for (const trade of trades) {
    if (symbolId === trade.symbol._id && trade.date <= new Date(date)) {
      if (trade.type === "buy") {
        position.total += Number(trade.qty) * Number(trade.price);
        position.totalQty += Number(trade.qty);
        position.precoMedio = position.total / position.totalQty;
      } else if (trade.type === "sell") {
        position.total -= Number(trade.qty) * position.precoMedio;
        position.totalQty -= Number(trade.qty);
      }
    }
  }
  return position;
};

export const buildPortfolioFromTrades = (trades) => {
  let portfolio = {};
  let sales = [];
  for (const trade of trades) {
    const { type, qty, price, symbol } = trade;
    const s = symbol._id;
    if (!portfolio.hasOwnProperty(s)) {
      portfolio[s] = {
        symbolId: s,
        symbol: symbol.symbol,
        companyName: symbol.companyName ? symbol.companyName : symbol.symbol,
        total: 0,
        totalQty: 0,
        precoMedio: 0,
        currentPrice: null,
        previousPrice: null,
      };
    }
    if (type === "buy") {
      portfolio[s].total += Number(qty) * Number(price);
      portfolio[s].totalQty += Number(qty);
      portfolio[s].precoMedio = portfolio[s].total / portfolio[s].totalQty;
    } else if (type === "sell") {
      portfolio[s].total -= Number(qty) * portfolio[s].precoMedio;
      portfolio[s].totalQty -= Number(qty);
      sales.push({
        symbolId: s,
        result: price * qty - portfolio[s].precoMedio * qty,
        ...trade,
      });
    }
  }
  return {
    currentPosition: sortAndReducePortfolio(portfolio),
    sales,
  };
};

/* array of objects in format {symbolId,symbol}  */
export const getPrices = async (symbols) => {
  try {
    const data = await fetch(URL + "/getCurrentPrices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbols }),
    }).then((res) => res.json());

    if (data.errors) throw Error();

    return data.reduce(
      (allPrices, currentPrice) => ({
        ...allPrices,
        [currentPrice.symbolId]: currentPrice.prices,
      }),
      {}
    );
  } catch (e) {
    return {
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
    };
  }
};

export const getIBOV = async () => {
  try {
    const data = await fetch(URL + "/ibov", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    return data;
  } catch (e) {
    return {
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
    };
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
