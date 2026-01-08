import bcrypt from "bcryptjs";
import { createTransporter } from "../config/mail.js";
import User from "../models/user.js";

const transport = createTransporter();

//student

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



//admin

export const getAllUsers = async (req, res) => {


  // BACKEND PAGINATION
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10
  // const skip = (page - 1) * limit 
  // const totalCount = await User.countDocuments()
  // const users = await User.find().skip(skip).limit(limit).select("-password")

  // res.status(200).json({
  //   users,
  //   totalCount,
  //   totalPages: Math.ceil(total/limit), currentPage: page
  // })
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin priviledge required",
      });
    }
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "all user sucessfully fetch",
      count: allUsers.length,
      users: allUsers,
    });
  } catch (error) {
    console.error("Get all user error", error);
    res.status(500).json({
      success: false,
      message: "Server fetching users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};




export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin priviledge required",
      });
    }

    const userData = await User.findById(id).select(
      "-password -resetPassowrdToken -refreshToken"
    );

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Getting user", error);
    res.status(500).json({
      success: false,
      message: "Server fetching user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};





export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!req.user) {
      return res.status(400).json({
        sucess: false,
        message: "Authentication Required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("update user", error);
    res.status(500).json({
      success: false,
      message: "update user error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
  

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const user = await User.findById(id);

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("deleting  user", error);
    res.status(500).json({
      success: false,
      message: "deleting user error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
