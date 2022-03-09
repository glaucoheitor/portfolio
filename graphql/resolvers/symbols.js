import Symbol from "../../models/symbol.js";

export async function getAllSymbols(args, req) {
  if (!req.isAuth) {
    throw new Error("UNAUTHENTICATED");
  }
  try {
    const symbols = await Symbol.find({});
    return symbols.map((s) => s._doc);
  } catch (err) {
    throw err;
  }
}

export async function getSymbolId({ symbol }, req) {
  if (!req.isAuth) {
    throw new Error("UNAUTHENTICATED");
  }
  try {
    const symbols = await Symbol.findOne({ symbol });
    return symbols?._id;
  } catch (err) {
    throw err;
  }
}
