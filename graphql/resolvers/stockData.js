const StockData = require("../../models/stockData");

const { symbol } = require("./populate");

module.exports = {
  stockData: async ({ symbolId }) => {
    try {
      const stockDatas = await StockData.find({
        symbol: symbolId,
      });
      return stockDatas.map((stockData) => ({
        ...stockData._doc,
        symbol: () => symbol(symbolId),
      }));
    } catch (err) {
      throw err;
    }
  },
  addStockData: async (args) => {
    const { date, open, high, low, close, adjClose, volume, symbolId } =
      args.stockDataInput;
    const trade = new StockData({
      date: new Date(date),
      open,
      high,
      low,
      close,
      adjClose,
      volume,
      symbol: symbolId,
    });
    try {
      const result = await trade.save();
      return {
        ...result._doc,
        symbol: () => symbol(result._doc.symbol),
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
