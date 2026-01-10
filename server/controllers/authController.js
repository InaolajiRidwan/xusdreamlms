import User from "../models/user.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createTransporter } from "../config/mail.js";

const transporter = createTransporter();

export const register = async (req, res) => {
  try {
    const { fullName, email, password, profilePicture } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All field is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3. Validate Password Strength/Length
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const emailToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
      emailVerificationToken: emailToken,
      emailVerificationExpires: Date.now() + 3600000,
      profilePicture: profilePicture || "",
    });

    await newUser.save();

    const link = `${process.env.CLIENT_URL}/verify-email/?token=${emailToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
               background-color: #f4f6f8;
              margin: 0;
              padding: 0;
            } 
            .container {
              max-width: 600px;
            margin: 40px auto;
             background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
          .header {
            background-color: #4f46e5;
            color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 20px 0;
        background-color: #4f46e5;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #f4f6f8;
        color: #888888;
        font-size: 12px;
        text-align: center;
        padding: 15px;
      }
      a {
        color: #4f46e5;
      }

      span {
      color: red;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Our XUSDREAMLMS!</h2>
      </div>
      <div class="content">
        <p>Hi ${email},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${link}" class="button">Verify Email</a>
        </p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <p>Welcome aboard,<br/>The XUSDREAMLMS TEAM</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <span>XUSDREAMLMS</span>. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
    });

    res.status(201).json({
      message: "user register successfully & verification email sent",
      user: {
        id: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("sign-up error:", error);
    res.status(500).json({
      success: false,
      message: "Server error signing up",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.isEmailVerified) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 3600000;
    await user.save();

    const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #4f46e5;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 20px 0;
        background-color: #4f46e5;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #f4f6f8;
        color: #888888;
        font-size: 12px;
        text-align: center;
        padding: 15px;
      }
      a {
        color: #4f46e5;
      }

      span {
      color: red;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Our XUSDREAMLMS!</h2>
      </div>
      <div class="content">
        <p>Hi ${email},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${link}" class="button">Verify Your Email</a>
        </p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <p>Welcome aboard,<br/>The XUSDREAMLMS TEAM</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <span>XUSDREAMLMS</span>. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
    });

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error Resending verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Optional: prevent re-verification
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found !!!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in....",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      }
    );

    user.refreshToken = refreshToken;

    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "you're successfully logged in",
      html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
               background-color: #f4f6f8;
              margin: 0;
              padding: 0;
            } 
            .container {
              max-width: 600px;
            margin: 40px auto;
             background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
          .header {
            background-color: #4f46e5;
            color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 20px 0;
        background-color: #4f46e5;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #f4f6f8;
        color: #888888;
        font-size: 12px;
        text-align: center;
        padding: 15px;
      }
      a {
        color: #4f46e5;
      }

      span {
      color: red;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Our XUSDREAMLMS!</h2>
      </div>
      <div class="content">
        <p>Hi ${user.fullName},</p>
        <p>You're successfully logged in <span >XUSDREAMLMS</span>:</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <span>XUSDREAMLMS</span>. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `Welcome back ${user.fullName}`,
      accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("login:", error);
    res.status(500).json({
      success: false,
      message: "Server error login-in",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        message: "Invalid session. Access denied.",
      });
    }
    const newAcessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      }
    );

    res.status(200).json({
      message: "success",
      accessToken: newAcessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("refrestoken error:", error);
    res.status(500).json({
      success: false,
      message: "refresh token server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({
      success: false,
      message: "logout error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    (user.resetPasswordToken = token),
      (user.resetPasswordExpires = Date.now() + 3600000);
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #4f46e5;
        color: white;
        padding: 25px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px 25px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        margin: 20px 0;
        background-color: #4f46e5;
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        background-color: #f4f6f8;
        color: #888888;
        font-size: 12px;
        text-align: center;
        padding: 20px;
      }
      a {
        color: #4f46e5;
      }
      p {
        margin: 15px 0;
      }
      .small {
        font-size: 13px;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>XUSDREAMLMS Password Reset</h1>
      </div>
      <div class="content">
        <p>Hi ${email},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="text-align: center;">
          <a href="${link}" class="button">Reset Password</a>
        </p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <p class="small">If you did not request a password reset, you can safely ignore this email.</p>
        <p>Thank you,<br/>The XUSDREAMLMS Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} XUSDREAMLMS. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
    });

    res.status(200).json({
      message: "Reset link sent",
    });
  } catch (error) {
    console.error("forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "forgot password error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Inavlid Token",
      });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = null;
    await user.save();
    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("resend password error:", error);
    res.status(500).json({
      success: false,
      message: "resend password error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//

// export const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User profile retrieved successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error in getUserProfile:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // 1. Match 'fullName' from your schema
//     const { fullName } = req.body;

//     let updateData = { fullName };

//     // 2. Handle the Cloudinary Upload
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "lms_profiles",
//         width: 200,
//         height: 200,
//         crop: "fill",
//         gravity: "face",
//       });

//       // 3. Match 'profileImage' from your schema
//       updateData.avatar = result.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
