import mongoose from "mongoose";

const { Schema } = mongoose;

const symbolSchema = new Schema({
  symbol: { type: String, required: true },
  lastRefreshed: { type: Date, required: false },
  companyName: { type: String, required: false },
  type: { type: String, required: false },
  stockData: {},
});

export default mongoose.model("Symbol", symbolSchema);
