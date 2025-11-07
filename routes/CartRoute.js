import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/CartController.js";

import authenticateToken from "../middleware/AuthenticationToken.js";

const router = express.Router();

router.get("/", authenticateToken, getCart); // Lihat keranjang
router.post("/", authenticateToken, addToCart); // Tambah ke keranjang
router.put("/:productId", authenticateToken, updateCartItem); // Ubah item
router.delete("/:productId", authenticateToken, removeCartItem); // Hapus item
router.delete("/clear", authenticateToken, clearCart); // Hapus item

export default router;
