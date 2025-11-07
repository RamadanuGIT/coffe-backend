import express from "express";
import {
  addMenu,
  deleteMenu,
  getAllMenu,
  getMenus,
  updateMenu,
} from "../controllers/MenuController.js";
import isAdmin from "../middleware/isAdmin.js";
import authenticateToken from "../middleware/AuthenticationToken.js";

const router = express.Router();

router.get("/admin", authenticateToken, isAdmin, getAllMenu);

router.post("/admin", authenticateToken, isAdmin, addMenu);

router.put("/admin/:id", authenticateToken, isAdmin, updateMenu);

router.delete("/admin/:id", authenticateToken, isAdmin, deleteMenu);

router.get("/", getMenus);

export default router;
