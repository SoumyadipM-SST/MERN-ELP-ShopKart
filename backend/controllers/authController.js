const userModel = require("../model/userModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 2 * 60 * 60 * 1000,
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are compulsory",
      });
    }

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Password regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      });
    }

    // Phone regex (at least 10 digits starting with 6, 7, 8, or 9)
    const cleanPhone = phone.replace(/\s+/g, ""); // removes spaces if user typed "+91 987..."
    const phoneRegex = /^[6-9]\d{9,}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        message: "Phone number must be at least 10 digits and start with 6, 7, 8, or 9",
      });
    }

    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
    });

    const user = await userModel.create({
      fullName,
      email,
      password: passwordHash,
      phone: cleanPhone,
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const payload = {
      id: user._id,
      email: user.email,
    };
    // token signature
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return res.status(200).cookie("token", token, cookieOptions).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server errror" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get user",
    });
  }
};

const logOut = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", cookieOptions).json({
      success: true,
      message: "logged out success",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server errror" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  logOut,
};
