import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("📌 Nodemailer user =", process.env.EMAIL_USER);
    console.log("📌 Password loaded =", process.env.EMAIL_PASS ? "Yes" : "No");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"WEEP" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📨 OTP Email sent successfully ✔️");
    console.log("📌 Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.log("❌ Nodemailer Error:", error);
    throw error; // send error back to server.js
  }
};
