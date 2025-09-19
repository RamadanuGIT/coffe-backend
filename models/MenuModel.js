import mongoose from "mongoose";

const MenuSchema = mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Jangan lupa kategori
    defaultPrice: { type: Number },
    variants: [
      {
        name: { type: String }, // e.g., "Hot", "Cold"
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Menu", MenuSchema);
