import express from "express";
import {
  addMenu,
  deleteMenu,
  getAllMenu,
  updateMenu,
} from "../controllers/MenuController.js";
import isAdmin from "../middleware/isAdmin.js";
import authenticateToken from "../middleware/AuthenticationToken.js";

const router = express.Router();

router.get("/admin/menu", authenticateToken, isAdmin, getAllMenu);

router.post("/admin/menu", authenticateToken, isAdmin, addMenu);

router.put("/admin/menu/:id", authenticateToken, isAdmin, updateMenu);

router.delete("/admin/menu/:id", authenticateToken, isAdmin, deleteMenu);

export default router;
