import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTP = async (email, otp) => {
  try {
    const sendSmtpEmail = {
      sender: { name: "WEEP Marketplace", email: "no-reply@weepsupport.com" },
      to: [{ email }],
      subject: "Your WEEP Marketplace OTP",
      htmlContent: `
        <div style="font-family: Arial; font-size: 16px;">
          <p>Your OTP for login is:</p>
          <h2 style="color: #2E8B57; font-size: 30px; letter-spacing: 3px;">${otp}</h2>
          <p>Valid for 5 minutes.</p>
        </div>
      `
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);
    console.log("📨 OTP email sent successfully ✔️ →", email);
  } catch (error) {
    console.error("❌ Email API error →", error.response?.text || error);
  }
};
