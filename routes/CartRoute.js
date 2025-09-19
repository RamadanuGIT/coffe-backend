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

router.get("/cart", authenticateToken, getCart); // Lihat keranjang
router.post("/cart", authenticateToken, addToCart); // Tambah ke keranjang
router.put("/cart/:productId", authenticateToken, updateCartItem); // Ubah item
router.delete("/cart/:productId", authenticateToken, removeCartItem); // Hapus item
router.delete("/cart/clear", authenticateToken, clearCart); // Hapus item

export default router;
