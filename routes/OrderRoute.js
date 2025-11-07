import express from "express";
import authenticateToken from "../middleware/AuthenticationToken.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/OrderController.js";

const router = express.Router();

// 🔹 Buat pesanan
router.post("/order", authenticateToken, createOrder);

// 🔹 Ambil semua pesanan user yang sedang login
router.get("/order/user", authenticateToken, getUserOrders);

router.get("/order/admin", authenticateToken, getAllOrders);
// 🔹 Ambil detail satu pesanan berdasarkan ID
router.get("/order/:id", authenticateToken, getOrder);

// 🔹 Batalkan pesanan
router.patch("/order/:id/cancel", authenticateToken, cancelOrder);

// 🔹 Admin: ambil semua pesanan

// 🔹 Admin: update status pesanan
router.patch(
  "/order/:id/updateOrderStatus",
  authenticateToken,
  updateOrderStatus
);

// 🔹 Admin: update status pembayaran
router.patch(
  "/order/:id/updatePaymentStatus",
  authenticateToken,
  updatePaymentStatus
);

export default router;
