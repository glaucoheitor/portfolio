const authResolver = require("./auth");
const tradesResolver = require("./trades");
const stockDataResolver = require("./stockData");

module.exports = rootResolver = {
  ...authResolver,
  ...tradesResolver,
  ...stockDataResolver,
};
