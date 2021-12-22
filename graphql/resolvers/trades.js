const Trade = require("../../models/trade");
const User = require("../../models/user");
const Symbol = require("../../models/symbol");

const { transformTrade } = require("./populate");

module.exports = {
  trades: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const trades = await Trade.find({});
      return trades.map(transformTrade);
    } catch (err) {
      throw err;
    }
  },
  tradesByUserId: async ({ userId }, req) => {
    //if (!req.isAuth) {throw new Error("Unauthenticated!")}
    try {
      const { trades } = await User.findById(userId, "trades").populate({
        path: "trades",
        populate: { path: "symbol" },
        options: { sort: { date: 1 } },
      });

      /*if (tradesIds.length === 0) {
        return tradesIds;
      }
      const trades = await Trade
      .find({ _id: { $in: tradesIds } }, null, {
        sort: { date: -1 },
      })
      .populate({});

       const symbolsIds = trades.map(({ symbol }) => symbol);

      const symbols = await Symbol.find({ _id: { $in: symbolsIds } });

      let symbolsNames = {};
      for (const symbol of symbols) {
        symbolsNames[symbol._id] = symbol.symbol;
      }
      console.log(symbolsNames); */

      return trades.map(transformTrade);
    } catch (err) {
      throw err;
    }
  },
  addTrade: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    console.log(req.userId);
    const { type, symbolId, qty, price, total, date } = args.tradeInput;
    const { userId } = req;
    const trade = new Trade({
      type: type,
      symbol: symbolId,
      qty: +qty,
      price: +price,
      total: +total,
      user: userId,
      date: new Date(date),
    });
    try {
      const result = await trade.save();
      const createdTrade = transformTrade(result);
      const existingUser = await User.findById(userId);
      if (!existingUser) throw new Error("User not found.");

      existingUser.trades.push(trade);
      await existingUser.save();
      return createdTrade;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteTrade: async ({ tradeId }) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const trade = await Trade.findById(tradeId);
      await Trade.deleteOne({ _id: tradeId });
      await User.updateOne(
        { _id: trade.user },
        {
          $pullAll: {
            trades: [tradeId],
          },
        }
      );
      return tradeId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
