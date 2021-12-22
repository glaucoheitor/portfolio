const Trade = require("../../models/trade");
const User = require("../../models/user");
const Symbol = require("../../models/symbol");

const transformTrade = ({ _doc }) => {
  return {
    ..._doc,
    user: () => user(_doc.user),
    //symbol: () => symbol(_doc.symbol),
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

const user = async (userId) => {
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

const symbol = async (symbolId) => {
  try {
    const symbol = await Symbol.findById(symbolId);
    return symbol._doc;
  } catch (err) {
    throw err;
  }
};

//exports.user = user;
//exports.trades = trades;
exports.symbol = symbol;
exports.transformTrade = transformTrade;
