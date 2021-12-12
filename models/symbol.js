const mongoose = require("mongoose");

const { Schema } = mongoose;

const symbolSchema = new Schema({
  symbol: { type: String, required: true },
  lastRefreshed: { type: Date, required: false },
});

module.exports = mongoose.model("Symbol", symbolSchema);
