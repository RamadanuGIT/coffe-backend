import { json } from "express";
import MenuSchema from "../models/MenuModel.js";

export const addMenu = async (req, res) => {
  const { image, title, variants, description, category } = req.body;
  if (!image || !title || !variants.length || !description || !category) {
    return res.status(400).json({ error: "Semua data harus diisi" });
  }
  try {
    const newMenu = new MenuSchema({
      image,
      title,
      variants,
      description,
      category,
    });
    await newMenu.save();
    return res
      .status(201)
      .json({ message: "Menu berhasil ditambahkan", data: newMenu });
  } catch (error) {
    res.status(500).json({ error: "Server error", data: error.message });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const menus = await MenuSchema.find();
    res
      .status(200)
      .json({ message: "Berhasil mengambil semua menu", data: menus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { image, title, variants, description, category } = req.body;

  if (!image || !title || !variants.length || !description || !category) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  try {
    const updatedMenu = await MenuSchema.findByIdAndUpdate(
      id,
      { image, title, variants, description, category },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu tidak ditemukan" });
    }

    return res
      .status(200)
      .json({ message: "Menu berhasil di update", data: updatedMenu });
  } catch (error) {
    res.status(500).json({ error: "server error", detail: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMenu = await MenuSchema.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ error: "Menu tidak ditemukan" });
    }

    res.status(200).json({ message: "Berhasil menghapus menu" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

// Menu public
export const menuPublic = async (req, res) => {
  try {
    const menus = await MenuSchema.find();
    res.json({
      success: true,
      message: "Berhasil menampilkan menu",
      data: menus,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error", detail: error.message });
  }
};
