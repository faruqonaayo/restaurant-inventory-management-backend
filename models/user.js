import mongoose from "mongoose";

const Schema = mongoose.Schema;

// schema for order
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
