import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  plateNumber: { type: String, required: true, unique: true }, // ✅ Added
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Customer", customerSchema);
