import bcrypt from "bcryptjs";
import { createTransporter } from "../config/mail.js";

const transport = createTransporter();

export const getMe = async (req, res) => {
  try {
    const { fullName, email, profilePicture } = req.user;

    res.status(200).json({
      message: "successful",
      userDetails: {
        fullName,
        email,
        profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = req.user;

    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;

    // FILE UPLOAD
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = req.user; // ✅ FIXED
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await transport.sendMail({
      to: user.email,
      subject: "Password successfully changed",
      html: `
        <h3>Hello ${user.fullName},</h3>
        <p>Your password was successfully changed.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
        <br />
        <small>Security Team</small>
      `,
    });

    res.status(200).json({
      message: "Password successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
