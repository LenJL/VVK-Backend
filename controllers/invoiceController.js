// controllers/invoiceController.js
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.js";
import PDFDocument from "pdfkit";

/**
 * Create new invoice (auto increment + customer link)
 */
export const createInvoice = async (req, res) => {
  try {
    const { name, phone, email, address, plateNumber, items, grandTotal, date } = req.body;

    // Find or create customer
    let customer = await Customer.findOne({ plateNumber });
    if (!customer) {
      customer = await Customer.create({ name, phone, email, address, plateNumber });
    }

    // Generate next bill number
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    const nextBillNo = lastInvoice
      ? (parseInt(lastInvoice.billNo) + 1).toString().padStart(4, "0")
      : "0001";

    // Create invoice
    const invoice = await Invoice.create({
      billNo: nextBillNo,
      date,
      customer: customer._id,
      plateNumber,
      items,
      grandTotal,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

/**
 * List invoices (latest first)
 */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).limit(100).populate("customer");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

/**
 * Generate and stream invoice PDF
 */
export const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) return res.status(404).send("Invoice not found");

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.billNo}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("V.V.K. Service Center", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Bill No: ${invoice.billNo}    Date: ${invoice.date.toISOString().slice(0, 10)}`);
    doc.text(`Customer: ${invoice.customer?.name || "-"}`);
    doc.text(`Vehicle: ${invoice.plateNumber || "-"}`);
    doc.moveDown();

    doc.fontSize(11).text("Particulars", 50, doc.y, { width: 300 });
    doc.text("Qty", 360, doc.y, { width: 60 });
    doc.text("Rate", 420, doc.y, { width: 80 });
    doc.text("Amount", 500, doc.y, { width: 80 });
    doc.moveDown();

    invoice.items.forEach((it) => {
      doc.fontSize(10).text(it.description, 50, doc.y, { width: 300 });
      doc.text(String(it.quantity), 360, doc.y);
      doc.text(String(it.rate.toFixed(2)), 420, doc.y);
      doc.text(String(it.total.toFixed(2)), 500, doc.y);
      doc.moveDown();
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total: ₹${Number(invoice.grandTotal || 0).toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
};
