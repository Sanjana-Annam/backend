import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendOTP } from "./emailService.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://frontend-rk0b.onrender.com",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.get("/", (req, res) => res.send("Backend running 🚀"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email & OTP required" });
  }

  console.log(`📩 OTP request for: ${email} → ${otp}`);

  try {
    await sendOTP(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return res.status(500).json({ message: "OTP sending failed", error });
  }
});

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on PORT ${PORT}`);
  console.log("📌 BREVO_USER:", process.env.BREVO_USER);
  console.log("📌 BREVO_PASS:", process.env.BREVO_PASS ? "Loaded" : "❌ Not Loaded");
  console.log("📌 Cloudinary Loaded:", process.env.CLOUDINARY_API_KEY ? "✔" : "❌");
});
