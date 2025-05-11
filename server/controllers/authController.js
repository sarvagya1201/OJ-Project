const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration Controller
const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Input Validation
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    user.password = undefined;

    res.status(200).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

module.exports = {register :  registerUser };
