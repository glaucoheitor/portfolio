import Trade from "../../models/trade.js";
import User from "../../models/user.js";
import Symbol from "../../models/symbol.js";

import { transformTrade } from "./populate.js";
import { getOnlyUserId } from "./auth.js";

export async function trades(args, req) {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  try {
    const trades = await Trade.find({});
    return trades.map(transformTrade);
  } catch (err) {
    throw err;
  }
}
export async function tradesByUserId({ userId }, req) {
  //if (!req.isAuth) {throw new Error("Unauthenticated!")}

  try {
    const trades = await Trade.find({ user: userId })
      .populate("symbol")
      .sort("date");

    //return the _doc property of each trade
    return trades.map(({ _doc }) => _doc);
    /*const { trades } = await User.findById(userId, "trades").populate({
      path: "trades",
      populate: { path: "symbol" },
      options: { sort: { date: 1 } },
    });

    if (tradesIds.length === 0) {
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
  } catch (err) {
    throw err;
  }
}

export async function addTrade(args, req) {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  console.log(req.userUid);

  const { type, symbolId, qty, price, total, date } = args.tradeInput;
  const { userUid } = req;

  const userId = await getOnlyUserId(userUid);

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
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new Error("User not found.");
    const result = await trade.save();
    const createdTrade = transformTrade(result);
    existingUser.trades.push(trade);
    await existingUser.save();
    return createdTrade;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function deleteTrade({ tradeId }) {
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
}
