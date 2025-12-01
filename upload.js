import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Debug
console.log("Cloudinary ENV =>", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer — store file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload to Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const base64String = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "weep-products",
    });

    // save URL to file path so controller can use it
    req.file.path = uploadResponse.secure_url;

    next();

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message
    });
  }
};

export default upload;
