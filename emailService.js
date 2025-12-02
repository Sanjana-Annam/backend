import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "WEEP <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("📨 OTP Email sent successfully ✔", data);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
