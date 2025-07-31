const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
   
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const userLogin = async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const { email, password } = req.body;

  try {
    const adminCredentials = {
      email: "emaanfatima0613@gmail.com",
      password: "12345678",
    };

    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      const token = generateToken("admin");
      return res.status(200).json({
        _id: "admin",
        name: "Admin",
        email: adminCredentials.email,
        token: token,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please go to this link: ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
      html: `<p>Reset your password <a href="${resetUrl}">here</a>.</p>`,
    });

    res.status(200).json({
      message: "Password reset email sent",
      resetUrl,
    });
  } catch (error) {
    if (error.message === "Email could not be sent") {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      }
    }

    res.status(500).json({ message: "Email could not be sent" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};
module.exports = { registerUser, userLogin, forgotPassword, resetPassword };
