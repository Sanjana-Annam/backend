import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

export const sendEmail = async (email, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"WEEP Marketplace" <${process.env.BREVO_USER}>`,   // 💥 Fix
      to: email,
      subject,
      html
    });

    console.log("📨 OTP Email sent successfully ✔", info.messageId);
  } catch (error) {
    console.error("❌ OTP Email sending failed →", error);
  }
};
