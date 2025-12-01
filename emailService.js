import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("EMAIL USER =", process.env.EMAIL_USER);
    console.log("EMAIL PASS =", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"WEEP" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📨 OTP Email sent successfully");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.log("❌ Email sending failed:");
    console.log(error);
  }
};
