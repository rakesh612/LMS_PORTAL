import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.js";
import OtpModel from "../models/otp.js";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import PendingRequests from "../models/PendingRequests.js";
import Cart from "../models/Cart.js";
import crypto from "crypto";
dotenv.config();

const JWT_EXPIRES = "7d";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function sendEmail(to, { subject, text, html }) {
  const emailUser = "gorantlamokshgnaism@gmail.com";
  const emailPass = "hqte waww vwse nhbk";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"EduCore" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const role = "user";
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields." });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
      isVerified: false,
    });

    await Cart.create({
      userId: newUser._id,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie("jwt", token, COOKIE_OPTIONS);
    await SendOtp({ email });
    return res.status(201).json({
      success: true,
      message: "Registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

async function SendOtp(obj) {
  try {
    const email = obj.email;
    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(404).json({ success: false, message: 'User not found.' });
      return false;
    }

    let existingOtp = await OtpModel.findOne({ email });
    if (existingOtp) {
      await OtpModel.findByIdAndDelete(existingOtp._id);
    }

    const plain = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(plain, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000;
    console.log(plain);
    await OtpModel.create({ email, codeHash: hashed, expiresAt });

    const sent = await sendEmail(email, {
      subject: "Your verification OTP",
      text: `OTP: ${plain}`,
      html: `<h1>${plain}</h1>`,
    });

    if (!sent) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let existingOtp = await OtpModel.findOne({ email });
    if (existingOtp) {
      await OtpModel.findByIdAndDelete(existingOtp._id);
    }

    const plain = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(plain, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000;
    console.log(plain);
    await OtpModel.create({ email, codeHash: hashed, expiresAt });

    const sent = await sendEmail(email, {
      subject: "Your verification OTP",
      text: `OTP: ${plain}`,
      html: `<h1>${plain}</h1>`,
    });

    if (!sent) {
      return res
        .status(500)
        .json({ success: false, message: "Error sending OTP." });
    }

    return res.json({ success: true, message: "OTP sent." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: "Already verified." });
    }

    const record = await OtpModel.findOne({ email });
    if (record.attempts <= 0) {
      await OtpModel.findByIdAndDelete(record._id);
      return res
        .status(502)
        .json({
          message:
            "Your attempts for this OTP are over; please resend by logging in again. OTP is being deleted.",
        });
    }
    if (!record || record.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found." });
    }

    const match = await bcrypt.compare(otp, record.codeHash);

    if (!match) {
      await OtpModel.findByIdAndUpdate(record._id, {
        $inc: { attempts: -1 },
      });
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    await OtpModel.findByIdAndDelete(record._id);
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie("jwt", token, COOKIE_OPTIONS);
    return res.json({ success: true, message: "Email verified." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong credentials." });
    }
    if (user.role === "instructor") {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });
      res.cookie("jwt", token, COOKIE_OPTIONS);
      return res.json({ success: true, user: user });
    }

    if (user.isVerified == false) {
      const existingOtp = await OtpModel.findOne({ email });
      if (existingOtp) {
        await OtpModel.findByIdAndDelete(existingOtp._id);
      }
      const plain = Math.floor(100000 + Math.random() * 900000).toString();
      const hashed = await bcrypt.hash(plain, 10);
      const expiresAt = Date.now() + 10 * 60 * 1000;
      await OtpModel.create({
        codeHash: hashed,
        expiresAt,
        email,
        attempts: 5,
      });
      const sent = await sendEmail(email, {
        subject: "Your verification OTP",
        text: `OTP: ${plain}`,
        html: `<h1>${plain}</h1>`,
      });

      if (!sent) {
        return res
          .status(500)
          .json({ success: false, error: "Error sending OTP." });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie("jwt", token, COOKIE_OPTIONS);
    const userObj = user.toObject?.() || { ...user };
    delete userObj.password;
    return res.json({
      success: true,
      message: "Logged in.",
      user: userObj,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt", COOKIE_OPTIONS);
    return res.json({ success: true, message: "Logged out." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const record = await OtpModel.findOne({ email });
    if (record && record.expiresAt < Date.now()) {
      await OtpModel.findByIdAndDelete(record._id);
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found." });
    }

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found." });
    }

    if (record.attempts <= 0) {
      await OtpModel.findByIdAndDelete(record._id);
      return res
        .status(502)
        .json({
          message:
            "Your attempts for this OTP are over; please resend by logging in again.",
        });
    }

    const match = await bcrypt.compare(otp, record.codeHash);

    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    await OtpModel.findByIdAndDelete(record._id);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie("jwt", token, COOKIE_OPTIONS);
    return res.json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}
export async function tempRegisterInstructor(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields." });
    }
    const role = "instructor";
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
      isVerified: false,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie("jwt", token, COOKIE_OPTIONS);
    return res.status(201).json({ success: true, message: "Registered successfully.", user: newUser });
  } catch (error) {
    console.error(error);
  }
}
export async function RegisterInstructor(req, res) {
  try {
    const { name, email, password, resumeUrl, idProofUrl } = req.body;
    const role = "instructor";
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    
    const request = await PendingRequests.create({
      instructorId: user._id,
      resumeUrl,
      idProofUrl,
    });
    await request.save();

    
    return res.status(201).json({
      success: true,
      message: "Registered successfully. Wait for admin verification.",
      user: user,
      request: {
        id: request._id,
        resumeUrl: request.resumeUrl,
        idProofUrl: request.idProofUrl,
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}

export async function checkRequest(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.role === "instructor") {
       const request = await PendingRequests.findOne({ instructorId: user._id });
       if (request) {
        return res.status(200).json({ success: true, message: "Instructor request found.", request: request });
       }
       else {
        return res.status(200).json({ success: false, message: "No instructor request found." });
       }
    }
    else {
      return res.status(200).json({ success: false, message: "User is not an instructor." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
}

export async function googleLogin(req, res) {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;

    // Example usage in front-end:
    // <GoogleLogin onSuccess={credentialResponse => {
    //   axiosInstance.post('/auth/googleLogin', { token: credentialResponse.credential });
    // }} />

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(64).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        password: hashedPassword,
        role: "user",
        email: email,
        name: name,
        isVerified: true,
      });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", jwtToken, COOKIE_OPTIONS);
    return res
      .status(200)
      .json({ success: true, message: "User logged in", user });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: e });
  }
}
