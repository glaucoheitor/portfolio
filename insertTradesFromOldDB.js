import Trade from "./models/trade.js";
import User from "./models/user.js";
import Symbol from "./models/symbol.js";
import fs from "fs";

const { data } = JSON.parse(fs.readFileSync("./negociacoes.json"));

export default async function (req, res) {
  const userId = "61c2311f9fd197cc682833f0";

  const trades = await Trade.find({ user: userId }, "_id");

  const user = await User.findById(userId);

  user.trades = trades;
  await user.save();

  res.send(user);
  return;

  /*const symbols = data.map((trade) => {
    return trade.symbol;
  });

  const symbolsIds = await Symbol.find({ symbol: symbols });

  const trades = data
    .map(
      (
        { date, type, symbol: symbolName, qty, price, total, id_user },
        index
      ) => {
        if (id_user !== "1" && id_user !== "2") return null;
        const symbol = symbolsIds.find((s) => s.symbol === symbolName);
        let symbolId;
        if (!symbol) {
          const insertSymbol = new Symbol({
            symbol: symbolName,
            lastRefreshed: null,
          });
          insertSymbol.save().then((result) => {
            symbolId = result.id;
          });
        } else {
          symbolId = symbol._id;
        }
        return {
          type: type,
          symbol: symbolId,
          qty: +qty,
          price: +price,
          total: +total,
          user:
            id_user === "1"
              ? "61b9983b6e311026b7bf0776"
              : "61c2311f9fd197cc682833f0",
          date: new Date(date),
        };
      }
    )
    .filter((t) => t !== null);

  const insertedTrades = await Trade.insertMany(trades);

    insertedTradesIds = insertedTrades.reduce(function (r, a) {
    r[a.user] = r[a.user] || [];
    r[a.user].push(a._id);
    return r;
  }, Object.create(null));

  Object.keys(insertedTradesIds).forEach(async (userId) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new Error("User not found.");
    existingUser.trades.push({
      $each: insertedTradesIds[userId],
    });
    await existingUser.save();
  });

  res.send(insertedTradesIds); */
  res.send(insertedTrades);
  return;
}
