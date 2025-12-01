import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Debug
console.log("Cloudinary ENV =>", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Use MULTER MEMORY STORAGE first
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Custom middleware to upload to cloudinary manually
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const b64 = req.file.buffer.toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "weep-products",
    });

    req.file.path = result.secure_url;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

export default upload;
