import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  billNo: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  
  // ✅ Link to Customer
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // connects to Customer model
    required: true,
  },

  // ✅ Keep plate number for quick lookup (optional redundancy)
  plateNumber: { type: String, required: true },
  
  items: [itemSchema],
  grandTotal: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Invoice", invoiceSchema);
