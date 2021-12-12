const Trade = require("../../models/trade");
const User = require("../../models/user");

const { transformTrade } = require("./populate");

module.exports = {
  trades: async () => {
    try {
      const trades = await Trade.find({});
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
