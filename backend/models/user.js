import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, required: true },

  providerId: { type: String },

  displayName: { type: String },

  email: { type: String },

  phoneNumber: { type: String },

  photoURL: { type: String },

  role: { type: String, required: true },

  trades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Trade",
    },
  ],
});

export default mongoose.model("User", userSchema);
