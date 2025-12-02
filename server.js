import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendEmail } from "./emailService.js";

const app = express();
app.use(express.json());

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: [
      "https://frontend-rk0b.onrender.com", // Render frontend
      "http://localhost:5173" // React local
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => res.send("Backend running 🚀"));
app.get("/health", (req, res) => res.json({ ok: true }));

/* ---------- OTP EMAIL API ---------- */
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email & OTP required" });
  }

  console.log(`📩 OTP request received for: ${email} → OTP: ${otp}`);

  const htmlTemplate = `
    <h2 style="color:#0d6efd">WEEP Login Verification</h2>
    <p>Your OTP for login is:</p>
    <h1 style="font-size: 32px; letter-spacing: 3px">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>.</p>
  `;

  try {
    await sendEmail(email, "Your WEEP Login OTP", htmlTemplate);
    console.log("📨 OTP Email sent successfully ✔");
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("❌ Error while sending OTP:", error);
    return res.status(500).json({ message: "OTP sending failed", error });
  }
});

/* ---------- PRODUCT UPLOAD ---------- */
let products = [];

app.post("/add-product", upload.single("image"), uploadToCloudinary, (req, res) => {
  const product = {
    title: req.body.title,
    price: req.body.price,
    desc: req.body.desc,
    category: req.body.category,
    sellerName: req.body.sellerName,
    sellerPhone: req.body.sellerPhone,
    image: req.file ? req.file.path : null,
    createdAt: new Date().toISOString()
  };

  products.push(product);
  res.status(201).json({ message: "Product uploaded", product });
});

app.get("/products", (req, res) => res.json(products));

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on PORT ${PORT}`);
  console.log("📌 EMAIL_USER =", process.env.EMAIL_USER);
  console.log("📌 EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "❌ Not Loaded");
});
