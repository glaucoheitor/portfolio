import mongoose from "mongoose";

const { Schema } = mongoose;

const stockDataSchema = new Schema({
  date: { type: Date, require: true },
  open: { type: Number },
  high: { type: Number },
  low: { type: Number },
  close: { type: Number, required: true },
  adjClose: { type: Number },
  volume: { type: Number },
  symbol: { type: Schema.Types.ObjectId, ref: "Symbol", required: true },
});

export default mongoose.model("StockData", stockDataSchema);
