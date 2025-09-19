import express from "express";
import {
  loginUser,
  profileUser,
  registerUser,
  updateUserProfile,
} from "../controllers/UserController.js";
import authenticateToken from "../middleware/AuthenticationToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// get router
router.get("/profil", authenticateToken, profileUser);

router.put("/profile", authenticateToken, updateUserProfile);

export default router;
