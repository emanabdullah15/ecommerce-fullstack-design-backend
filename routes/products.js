const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Map categories to folders
const categoryFolder = {
  "consumer-electronics": "tech",
  "home-outdoor": "interior",
  "recommended": "cloth",
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = categoryFolder[req.body.category] || "others";

    // Save files into frontend public/images folder
    const dir = path.join(__dirname, "..", "..","frontend", "public", "images", folder);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(404).json({ msg: "Invalid ID" });
  }
});

// CREATE PRODUCT
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, category, price, discount, description } = req.body;

    let imgPath = "";
    if (req.file) {
      const folder = categoryFolder[category] || "others";
      imgPath = `/images/${folder}/${req.file.filename}`;
    }

    const product = new Product({
      name,
      category,
      price,
      discount,
      description,
      img: imgPath,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, category, price, discount, description } = req.body;

    let updateData = { name, category, price, discount, description };

    if (req.file) {
      const folder = categoryFolder[category] || "others";
      updateData.img = `/images/${folder}/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;