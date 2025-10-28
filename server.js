// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";

import connectDB from "./config/db.js";
import customerRoutes from "./routes/customerRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// Connect to DB
connectDB();

// Initialize Firebase Admin (if credentials exist)
if (process.env.FCM_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.FCM_SERVICE_ACCOUNT_PATH)) {
  const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(process.env.FCM_SERVICE_ACCOUNT_PATH)));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

// Root Route
app.get("/", (req, res) => res.send("🚴‍♂️ V.V.K. Service Backend Running..."));

// Routes
app.use("/customers", customerRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/utils", utilityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
