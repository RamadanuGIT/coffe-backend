import User from "../models/UserModel.js";
import authenticateToken from "../middleware/AuthenticationToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Username, email dan password tidak boleh kosong",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, error: "Username dan Email sudah digunakan" });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "Daftar berhasil",
      user: { username, email },
    });
  } catch (error) {
    console.error("Gagal mendaftar: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Terjadi kesalahan server" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Username dan password tidak boleh kosong",
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, error: "Password salah" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Terjadi kesalahan server" });
  }
};

export const profileUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User tidak ditemukan" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server eror" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, handphone, alamat } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "User tidak ditemukan" });

    // Update hanya jika dikirim
    if (username) user.username = username;
    if (email) user.email = email;
    if (handphone) user.handphone = handphone;
    if (alamat) user.alamat = alamat;

    await user.save();

    res.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Terjadi kesalahan server" });
  }
};
