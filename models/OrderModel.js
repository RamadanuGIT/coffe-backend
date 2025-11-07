import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },

        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Menunggu Pembayaran",
        "Diproses",
        "Siap Diambil",
        "Sedang Diantar",
        "Selesai",
        "Dibatalkan",
      ],
      default: "Menunggu Pembayaran",
    },
    metodePembayaran: {
      type: String,
      enum: ["cash", "transfer", "ewallet", "qris"],
      required: true,
    },
    metodePengiriman: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    alamat: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
