// routes/invoiceRoutes.js
import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  generateInvoicePDF,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.get("/:id/pdf", generateInvoicePDF);


export default router;
