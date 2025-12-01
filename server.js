import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendEmail } from "./emailService.js";

const app = express();

// CORS

app.use(cors({
  origin: "*", // For now allow all — after testing you can restrict to frontend
  credentials: true
}));


app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend working locally 🚀");
});

// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("OTP requested for:", email, otp);

  try {
    await sendEmail(
      email,
      "Your WEEP Login OTP",
      `<h1>Your OTP is ${otp}</h1>`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Dummy Products DB
let products = [];

// Upload Product
app.post("/add-product", upload.single("image"), uploadToCloudinary, (req, res) => {
  try {
    const product = {
      title: req.body.title,
      price: req.body.price,
      desc: req.body.desc,
      category: req.body.category,
      sellerName: req.body.sellerName,
      sellerPhone: req.body.sellerPhone,
      image: req.file.path,
    };

    products.push(product);
    res.json({ message: "Product uploaded successfully", product });
  } catch (error) {
    console.log("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

// Get products
app.get("/products", (req, res) => res.json(products));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
