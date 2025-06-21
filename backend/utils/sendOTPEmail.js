const nodemailer = require("nodemailer");
require("dotenv").config();
/**
 * Send OTP email using nodemailer
 * @param {string} email - Recipient email address
 * @param {string|number} otp - OTP code to send
 */
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Twitter Clone By Darsh - Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Hello,</p><p>Your OTP is: <b>${otp}</b></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("OTP email sent:", info.response);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
