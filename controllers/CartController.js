import Cart from "../models/CartModel.js";
import mongoose from "mongoose";

// GET /cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// POST /cart

export const addToCart = async (req, res) => {
  const { productId, name, price, quantity, img, variant } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Convert productId string to ObjectId
    const prodId = new mongoose.Types.ObjectId(productId);

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === prodId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: prodId,
        name,
        price,
        quantity,
        img,
        variant,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res
      .status(500)
      .json({ success: false, error: "Gagal menambahkan ke cart" });
  }
};

// PUT /cart
export const updateCartItem = async (req, res) => {
  const { quantity, variant } = req.body;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, error: "Cart tidak ditemukan" });

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        (!variant || item.variant === variant)
    );

    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json({ success: true, cart });
    } else {
      res
        .status(404)
        .json({ success: false, error: "Item tidak ditemukan di cart" });
    }
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// DELETE /cart/:productId
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const { variant } = req.query;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, error: "Cart tidak ditemukan" });

    cart.items = cart.items.filter((item) => {
      // hapus item jika productId sama dan variant sama (jika variant dikirim)
      if (variant) {
        return !(item.productId.equals(productId) && item.variant === variant);
      } else {
        return !item.productId.equals(productId);
      }
    });

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, error: "Gagal menghapus item" });
  }
};

// DELETE /cart/clear
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, error: "Cart tidak ditemukan" });
    }

    cart.items = []; // kosongkan item
    await cart.save();

    res.json({ success: true, message: "Cart dikosongkan" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Gagal mengosongkan cart" });
  }
};
