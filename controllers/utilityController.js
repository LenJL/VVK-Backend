// controllers/utilityController.js
import { createCanvas } from "canvas";
import twilio from "twilio";
import admin from "firebase-admin";
import Invoice from "../models/Invoice.js";


// Twilio setup (read from env)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// generate Bill number
export const getNextBillNumber = async (req, res) => {
  try {
    console.log("Fetching latest invoice...");
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    console.log("Last invoice:", lastInvoice);

    const nextBillNo = lastInvoice
      ? (parseInt(lastInvoice.billNo) + 1).toString().padStart(4, "0")
      : "0001";

    res.json({ billNo: nextBillNo });
  } catch (err) {
    console.error("Bill number fetch error:", err);
    res.status(500).json({ error: "Failed to get bill number" });
  }
};

// Generate plate image
export const generatePlateImage = async (req, res) => {
  const { plate = "", bike = "" } = req.body || {};
  const width = 800,
    height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000";
  ctx.fillRect(30, 60, width - 60, 180);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 72px Sans";
  ctx.fillText(plate.toUpperCase(), 50, 150);
  ctx.font = "bold 28px Sans";
  ctx.fillText(bike, 50, 200);

  const buffer = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};

// Send SMS
export const sendSMS = async (req, res) => {
  if (!twilioClient) return res.status(500).json({ error: "Twilio not configured" });
  const { to, body } = req.body;
  try {
    const msg = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_SMS_FROM,
      to,
    });
    res.json({ sid: msg.sid });
  } catch (err) {
    res.status(500).json({ error: "SMS send failed" });
  }
};

// Send WhatsApp message
export const sendWhatsApp = async (req, res) => {
  if (!twilioClient) return res.status(500).json({ error: "Twilio not configured" });
  const { to, body, mediaUrl } = req.body;
  try {
    const msg = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      mediaUrl,
    });
    res.json({ sid: msg.sid });
  } catch (err) {
    res.status(500).json({ error: "WhatsApp failed" });
  }
};

// Send FCM notification
export const sendNotification = async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({ error: "FCM not configured" });
  const { token, title, body, invoiceId } = req.body;
  try {
    const message = {
      token,
      notification: { title, body },
      data: { invoiceId: invoiceId || "" },
    };
    const resp = await admin.messaging().send(message);
    res.json({ result: resp });
  } catch (err) {
    res.status(500).json({ error: "Notification failed" });
  }
};
