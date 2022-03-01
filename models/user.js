import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, unique: true },

  authProvider: { type: String },

  name: { type: String, required: true },

  email: {
    type: String,
    required: [true, "An email is required for a user"],
    unique: true,
  },

  phone: { type: String, unique: true },

  password: {
    type: String,
    required: [true, "A password is required for a user"],
  },

  role: { type: String, required: true },

  trades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Trade",
    },
  ],
});

export default mongoose.model("User", userSchema);
