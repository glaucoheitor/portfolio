import Symbol from "../../models/symbol.js";

export async function symbols(args, req) {
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
