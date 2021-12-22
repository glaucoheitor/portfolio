export const buildPortfolioFromTrades = (trades) => {
  let portfolio = {};
  let s;
  for (const trade of trades) {
    s = trade.symbol._id;
    if (!portfolio.hasOwnProperty(s)) {
      portfolio[s] = {
        symbolName: trade.symbol.symbol,
        total: 0,
        totalQty: 0,
        precoMedio: 0,
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
  return portfolio;
};
