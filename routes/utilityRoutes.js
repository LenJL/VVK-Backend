// routes/utilityRoutes.js
import express from "express";
import {
  generatePlateImage,
  sendSMS,
  sendWhatsApp,
  sendNotification,
  getNextBillNumber, 
} from "../controllers/utilityController.js";

const router = express.Router();

router.post("/send-sms", sendSMS);
router.post("/send-whatsapp", sendWhatsApp);
router.post("/notify-ready", sendNotification);
router.get("/billno", getNextBillNumber);


export default router;
