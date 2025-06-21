const nodemailer = require("nodemailer");

/**
 * Send OTP email using nodemailer
 * @param {string} email - Recipient email address
 * @param {string|number} otp - OTP code to send
 */
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "darshback24@gmail.com",
      pass: "cdhccwuxwtttcdha", 
    },
  });

  const mailOptions = {
    from: '"Twitter Clone By Darsh - Support" <darshback24@gmail.com>',
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
