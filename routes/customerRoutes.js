// routes/customerRoutes.js
import express from "express";
import { addCustomer, getCustomers } from "../controllers/customerController.js";

const router = express.Router();

router.post("/", addCustomer); // POST /customers
router.get("/", getCustomers); // GET /customers

export default router;
