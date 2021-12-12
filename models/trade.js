const mongoose = require("mongoose");

const { Schema } = mongoose;

const tradeSchema = new Schema(
  {
    type: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    symbol: { type: Schema.Types.ObjectId, ref: "Symbol" },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trade", tradeSchema);
