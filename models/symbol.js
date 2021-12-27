import mongoose from "mongoose";

const { Schema } = mongoose;

const symbolSchema = new Schema({
  symbol: { type: String, required: true },
  lastRefreshed: { type: Date, required: false },
  companyName: {
    longName: { type: String },
    shortName: { type: String },
  },
  stockData: {},
});

export default mongoose.model("Symbol", symbolSchema);
