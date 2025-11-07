import mongoose from "mongoose";
import Order from "../models/OrderModel.js";
import MenuModel from "../models/MenuModel.js";

// 🔹 Create order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware auth
    const {
      customer,
      alamat,
      metodePengiriman,
      metodePembayaran,
      total,
      items,
    } = req.body;

    // Jangan validasi ID Menu, ambil langsung dari frontend
    const orderItems = await Promise.all(
      items.map(async (i) => {
        if (!mongoose.Types.ObjectId.isValid(i.productId)) {
          throw new Error(`ID produk tidak valid: ${i.productId}`);
        }

        // 🟢 gunakan i.productId, bukan items.menuId
        const menu = await MenuModel.findById(i.productId?.toString());

        if (!menu) {
          throw new Error(`Menu dengan ID ${i.productId} tidak ditemukan`);
        }

        return {
          productId: menu._id,
          name: menu.title,
          variant: i.variant,
          price: i.price || menu.defaultPrice,
          quantity: i.quantity,
        };
      })
    );

    const order = new Order({
      userId,
      customer,
      alamat,
      metodePengiriman,
      metodePembayaran,
      total,
      items: orderItems,
    });

    await order.save();

    const savedOrder = await Order.findById(order._id)
      .populate("userId", "username")
      .populate("items.productId", "title, price");

    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Gagal membuat pesanan",
    });
  }
};

// 🔹 Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username")
      .populate("items.productId", "title price"); // ambil data terbaru dari menu

    // Buat fallback: kalau productId null, tetap tampilkan item.name
    const formattedOrders = orders.map((o) => {
      const items = o.items.map((item) => ({
        ...item._doc,
        title: item.productId?.title || item.name || "Unknown",
      }));
      return { ...o._doc, items };
    });

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ORDERS USER
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "title price");

    const formattedOrders = orders.map((o) => {
      const items = o.items.map((item) => ({
        ...item._doc,
        title: item.productId?.title || item.name || "Unknown",
      }));
      return { ...o._doc, items };
    });

    res.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal ambil pesanan" });
  }
};

// 🔹 Get single order (user)
export const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ success: false, message: "ID tidak valid" });

  try {
    const order = await Order.findOne({
      _id: id,
      userId: req.user.id,
    }).populate("items.productId", "title");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order tidak ditemukan" });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (order.status !== "Menunggu Pembayaran")
      return res.status(400).json({ message: "Order tidak bisa dibatalkan" });

    order.status = "Dibatalkan";
    await order.save();

    res.json({ message: "Order berhasil dibatalkan", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 🔹 Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ success: false, message: "ID tidak valid" });

  try {
    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order tidak ditemukan" });

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Status pesanan berhasil diupdate",
      order,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// 🔹 Update payment status (admin)
export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ success: false, message: "ID tidak valid" });

  try {
    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order tidak ditemukan" });

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: "Status pembayaran berhasil diupdate",
      order,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};
