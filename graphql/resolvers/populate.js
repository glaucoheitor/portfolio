import Trade from "../../models/trade.js";
import User from "../../models/user.js";
import Symbol from "../../models/symbol.js";

export const transformTrade = ({ _doc }) => {
  return {
    ..._doc,
    user: () => user(_doc.user),
    symbol: () => symbol(_doc.symbol),
  };
};

const trades = async (tradeIds) => {
  try {
    const trades = await Trade.find({ _id: { $in: tradeIds } });
    return trades.map(transformTrade);
  } catch (err) {
    throw err;
  }
};

export const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      trades: () => trades(user._doc.trades),
    };
  } catch (err) {
    throw err;
  }
};

export const symbol = async (symbolId) => {
  try {
    const symbol = await Symbol.findById(symbolId);
    return symbol._doc;
  } catch (err) {
    throw err;
  }
};
