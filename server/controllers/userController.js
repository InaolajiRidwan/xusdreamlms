import User from "../models/user.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import fs from "fs";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
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

    let hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "user register successfully",
      user: {
        id: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(`Registration Error ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: `Welcome back ${user.fullName}`,
      token,
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Match 'fullName' from your schema
    const { fullName } = req.body;

    let updateData = { fullName };

    // 2. Handle the Cloudinary Upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms_profiles",
        width: 200,
        height: 200,
        crop: "fill",
        gravity: "face",
      });

      // 3. Match 'profileImage' from your schema
      updateData.avatar = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
