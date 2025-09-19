import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export default function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "acces denied. Admin only!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: "Token tidak valid" });
  }
}
