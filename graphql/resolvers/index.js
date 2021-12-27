import * as authResolver from "./auth.js";
import * as tradesResolver from "./trades.js";
import * as stockDataResolver from "./stockData.js";

export default { ...authResolver, ...tradesResolver, ...stockDataResolver };
