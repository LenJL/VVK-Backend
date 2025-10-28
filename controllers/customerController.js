// controllers/customerController.js
import Customer from "../models/Customer.js";

/**
 * Add a new customer
 */
export const addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, plateNumber } = req.body;

    const existing = await Customer.findOne({ plateNumber });
    if (existing) return res.status(400).json({ message: "Customer already exists" });

    const customer = await Customer.create({ name, phone, email, address, plateNumber });
    res.status(201).json(customer);
  } catch (err) {
    console.error("Add customer error:", err);
    res.status(500).json({ error: "Failed to add customer" });
  }
};

/**
 * Search or list customers
 */
export const getCustomers = async (req, res) => {
  try {
    const q = req.query.q || "";
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { plateNumber: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const customers = await Customer.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
