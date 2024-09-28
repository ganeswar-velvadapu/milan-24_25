import User from "../models/user.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const validDomain = "@iith.ac.in";

const hostels = [
  "ARYABHATTA",
  "BHASKARA",
  "BRAHMAGUPTA",
  "CHARAKA",
  "GARGI",
  "KAPILA",
  "KAUTILYA",
  "MAITREYI",
  "RAMANUJA",
  "SUSRUTA",
  "VARAHAMIHIRA",
  "VYASA",
  "RAMAN",
  "RAMANUJAN",
  "KALAM",
  "SARABHAI",
  "BHABHA",
  "VISVESWARAYA",
  "ANANDI",
  "SAROJINI NAIDU",
  "VIVEKANANDA",
  "SN BOSE",
];

const branches = [
    'Artificial Intelligence',
    'Biomedical Engineering',
    'Biotechnology',
    'Chemical Engineering',
    'Climate Change',
    'Civil Engineering',
    'Computer Science and Engineering',
    'Electrical Engineering',
    'Engineering Science',
    'Heritage Science and Technology',
    'Materials Science and Metallurgical Engineering',
    'Mechanical & Aerospace Engineering',
    'Industrial Chemistry'
]

const year = [
    'Alumni',
    '2021-2025',
    '2022-2026',
    '2023-2027',
    '2024-2028'
]

const companies =  [
  'Accenture (S&C)',
  'Amazon',
  'American Express',
  'Bajaj Auto',
  'Bharat Electronics',
  "BYJU'S",
  'Deloitte',
  'Flipkart',
  'Google',
  'HCL',
  'JP Morgan Chase',
  'Jaguar Land Rover',
  'Jio Platforms',
  'Meesho',
  'Microsoft',
  'Oracle',
  'Qualcomm',
  'Tata Unistore',
  'Whirlpool',
  'Zomato'
]




function validateEmail(email) {
  return email.endsWith(validDomain);
}

const otpStore = {};

export const signup = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "Enter all details",
      });
    }

    if (!validateEmail(email)) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "Please use a valid IITH email",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "User already exists. Please try to login",
      });
    }

    const otp = generateOtp();
    otpStore[email] = { otp, createdAt: Date.now() };

    const token = req.cookies.token;
    await sendOtp(email, otp);
    res.render("../views/user/otp.ejs", { token, message: null });
  } catch (error) {
    console.error(error);
    return res.render("../views/user/login.ejs", {
      token: null,
      message: "Internal Server Error",
    });
  }
};

export const verifyOtpAndSaveUser = async (req, res) => {
  const { username, password, degree, hostel, year, branch,company } =
    req.body;
  const newToken = req.cookies.newToken;
  try {
    if (!newToken) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "Internal Server Error",
      });
    }

    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
    const email = decoded.email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      degree,
      hostel,
      year,
      branch,
      company: company.toString(),
    });

    await newUser.save();

    delete otpStore[email];

    res.clearCookie("newToken");
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("../views/user/login.ejs", {
      token: null,
      message: "Internal Server Error",
    });
  }
};

export const verifyOtp = (req, res) => {
  const { clientOtp, email } = req.body;
  const token = req.cookies.token;
  try {
    const otpData = otpStore[email];
    if (!otpData) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    const { otp: storedOtp, createdAt } = otpData;

    const otpValidityDuration = 10 * 60 * 1000;
    if (Date.now() - createdAt > otpValidityDuration) {
      delete otpStore[email];
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (storedOtp.toString() !== clientOtp.toString()) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "Invalid OTP. Please try again.",
      });
    }

    const newToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("newToken", newToken, {
      httpOnly: true,
    });
    res.render("../views/user/afterotp.ejs", { token, message: null,hostels,branches,year,companies });
    // return res.status(200).json({ "message": "OTP verified", token });
  } catch (error) {
    console.error(error);
    return res.render("../views/user/login.ejs", {
      token: null,
      message: "Internal Server Error",
    }); 
  }
};

async function sendOtp(email, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from: `"Signup Verification" <${process.env.MAIL}>`,
    to: email,
    subject: "OTP for Signup Verification",
    text: `Your OTP for signup is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render("../views/user/login.ejs", {
        token: null,
        message: "Wrong Password",
      });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // return res.status(200).json({
    //     "message": "Login Successful",
    //     "token" : token
    // });
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("../views/user/login.ejs", {
      token: null,
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.render("../views/user/login.ejs", { token: null, message: null });
  } catch (error) {
    console.error(error);
    return res.render("../views/user/login.ejs", {
      token: null,
      message: "Internal Server Error",
    });
  }
};
