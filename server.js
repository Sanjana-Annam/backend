import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendEmail } from "./emailService.js";

const app = express();

/* -----------------------
   MIDDLEWARE
   ----------------------- */
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* -----------------------
   HEALTH & DEBUG
   ----------------------- */
app.get("/", (req, res) => {
  res.send("Backend running (root) ✅");
});

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "Backend working successfully!" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: {
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      email_user: !!process.env.EMAIL_USER,
      port: process.env.PORT,
    },
  });
});

/* -----------------------
   OTP EMAIL
   ----------------------- */
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "email and otp are required" });
  }

  try {
    await sendEmail(
      email,
      "Your WEEP Login OTP",
      `<h2>WEEP Login Verification</h2><p>Your OTP is:</p><h1>${otp}</h1><p>This code is valid for 5 minutes.</p>`
    );
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP send error:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: String(error) });
  }
});

/* -----------------------
   PRODUCT UPLOAD
   ----------------------- */
let products = [];

app.post("/add-product", upload.single("image"), uploadToCloudinary, (req, res) => {
  try {
    const product = {
      title: req.body.title,
      price: req.body.price,
      desc: req.body.desc,
      category: req.body.category,
      sellerName: req.body.sellerName,
      sellerPhone: req.body.sellerPhone,
      image: req.file ? req.file.path : null,
      createdAt: new Date().toISOString(),
    };

    products.push(product);
    return res.status(201).json({ message: "Product uploaded successfully", product });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: String(error) });
  }
});

app.get("/products", (req, res) => res.json(products));

/* -----------------------
   START SERVER (Railway SAFE)
   ----------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT=${PORT}`);
});

export default app;
