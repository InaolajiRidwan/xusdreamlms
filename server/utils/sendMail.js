// src/utils/sendEmail.js
import nodemailer from "nodemailer";

const PORT = process.env.PORT || 5000;

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD, // Use an "App Password," not your real password
    },
  });

  const url = `http://localhost:${PORT}/api/auth/verify/${token}`;
  console.log("📨 Sending verification email to:", email);
  console.log("🔗 Verification Link:", url);

  await transporter.sendMail({
    from: '"Xusdream LMS" <noreply@lms.com>',
    to: email,
    subject: "Verify your LMS Account",
    html: `<h3>Welcome to the LMS!</h3>
           <p>Please click the link below to verify your account:</p>
           <a href="${url}">${url}</a>`,
  });
};

export default sendVerificationEmail;
