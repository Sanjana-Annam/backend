import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // important for Brevo (STARTTLS support)
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"WEEP Marketplace" <sanjanaannam95@gmail.com>`, // must be verified in Brevo
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:Arial; font-size:16px">
          <p>Hi 👋,</p>
          <p>Your OTP for login is:</p>
          <h2 style="color:#2E8B57; font-size:30px; letter-spacing:3px;">${otp}</h2>
          <p>This OTP is valid for 5 minutes.</p>
          <p>— WEEP Marketplace Team</p>
        </div>
      `
    });

    console.log("📨 OTP Email sent successfully ✔");
  } catch (error) {
    console.error("❌ OTP Email sending failed →", error);
  }
};
