import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendEmail } from "./emailService.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* HEALTH */
app.get("/", (req, res) => res.send("Backend working ✅"));
app.get("/_health", (req, res) => res.status(200).send("ok"));

let products = [];

/* OTP EMAIL */
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "email and otp required" });
  try {
    await sendEmail(
      email,
      "Your WEEP Login OTP",
      `<h2>WEEP Login Verification</h2><h1>${otp}</h1><p>Valid for 5 minutes.</p>`
    );
    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* PRODUCT UPLOAD */
app.post("/add-product", upload.single("image"), uploadToCloudinary, (req, res) => {
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
  return res.status(201).json({ message: "Product uploaded", product });
});
app.get("/products", (req, res) => res.json(products));

/* KEEP ALIVE / HEALTH CHECK */
app.get("/", (req, res) => res.send("Backend running 🚀"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* START SERVER */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT=${PORT}`);
  console.log("Cloudinary ENV =>", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);
});
