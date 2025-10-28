// middleware/validator.js
export function validateCustomer(req, res, next) {
  const { name, plateNumber } = req.body;
  if (!name || !plateNumber) {
    return res.status(400).json({ error: "Customer name and plate number are required." });
  }
  next();
}

export function validateInvoice(req, res, next) {
  const { items, plateNumber } = req.body;
  if (!plateNumber) {
    return res.status(400).json({ error: "Plate number is required." });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invoice must have at least one item." });
  }
  next();
}
