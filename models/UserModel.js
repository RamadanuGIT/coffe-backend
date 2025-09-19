import mongoose from "mongoose";

const User = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  handphone: { type: String, default: "" },
  alamat: { type: String, default: "" },
});

export default mongoose.model("User", User);
