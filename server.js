<<<<<<< HEAD
// server.js — Final corrected version for local + Railway
=======
>>>>>>> 8967a715cccd8037d74a8f94828df7e4a968181b
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import upload from "./upload.js";
import { uploadToCloudinary } from "./upload.js";
import { sendEmail } from "./emailService.js";

const app = express();

<<<<<<< HEAD
/* -----------------------
   MIDDLEWARE
   ----------------------- */
app.use(express.json());

// CORS - during development allow all, tighten for production
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

/* -----------------------
   DEBUG / HEALTH ENDPOINTS
   ----------------------- */
// Basic root
app.get("/", (req, res) => {
  res.send("Backend running (root) ✅");
});

// Simple test
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "Backend working successfully!" });
});

// Railway-specific quick check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: {
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      email_user: !!process.env.EMAIL_USER,
      port: process.env.PORT || "not-set"
    }
  });
});

/* -----------------------
   OTP EMAIL ENDPOINT
   ----------------------- */
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "email and otp are required" });
  }

  console.log("📩 OTP request received:", { email, otp });
=======
// CORS
app.use(cors({
  origin: "*", // allow all during testing locally
  methods: ["GET", "POST"],
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
>>>>>>> 8967a715cccd8037d74a8f94828df7e4a968181b

  try {
    await sendEmail(
      email,
      "Your WEEP Login OTP",
<<<<<<< HEAD
      `<h2>WEEP Login Verification</h2><p>Your OTP is:</p><h1>${otp}</h1><p>This code is valid for 5 minutes.</p>`
    );
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP send error:", error && (error.message || error));
    return res.status(500).json({ message: "Failed to send OTP", error: String(error) });
  }
});

/* -----------------------
   PRODUCT UPLOAD (in-memory)
   ----------------------- */
let products = [];

=======
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
>>>>>>> 8967a715cccd8037d74a8f94828df7e4a968181b
app.post("/add-product", upload.single("image"), uploadToCloudinary, (req, res) => {
  try {
    const product = {
      title: req.body.title,
      price: req.body.price,
      desc: req.body.desc,
      category: req.body.category,
      sellerName: req.body.sellerName,
      sellerPhone: req.body.sellerPhone,
<<<<<<< HEAD
      image: req.file ? req.file.path : null,
      createdAt: new Date().toISOString()
    };

    products.push(product);
    return res.status(201).json({ message: "Product uploaded successfully", product });
  } catch (error) {
    console.error("❌ Upload error:", error && error.message ? error.message : error);
    return res.status(500).json({ message: "Upload failed", error: String(error) });
  }
});

app.get("/products", (req, res) => {
  res.json(products);
});

/* -----------------------
   START SERVER (Railway-friendly)
   ----------------------- */
const PORT = process.env.PORT || 8080;

// Helpful debug log for env variables (hides secrets)
console.log("Loaded env ->",
  "CLOUDINARY_CLOUD_NAME:", !!process.env.CLOUDINARY_CLOUD_NAME,
  "CLOUDINARY_API_KEY:", !!process.env.CLOUDINARY_API_KEY,
  "EMAIL_USER:", !!process.env.EMAIL_USER
);

// Listen on the port Railway provides and bind to 0.0.0.0
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on PORT ${PORT} (0.0.0.0) — ready`);
});

/* -----------------------
   GRACEFUL SHUTDOWN HANDLERS
   ----------------------- */
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error("Error during server close:", err);
      process.exit(1);
    }
    console.log("Closed out remaining connections. Exiting.");
    process.exit(0);
  });

  // force exit after 10s
  setTimeout(() => {
    console.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/* -----------------------
   EXPORT (for tests or other use)
   ----------------------- */
export default app;
=======
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

>>>>>>> 8967a715cccd8037d74a8f94828df7e4a968181b
