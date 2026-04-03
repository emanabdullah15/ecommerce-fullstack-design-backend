const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Map categories to Cloudinary subfolders
const categoryFolder = {
  "consumer-electronics": "tech",
  "home-outdoor": "interior",
  "recommended": "cloth",
};

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = categoryFolder[req.body.category] || "others";
    return {
      folder: `products/${folder}`,
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// GET ALL PRODUCTS WITH FILTERS
router.get("/", async (req, res) => {
  try {
    const { brand, features, condition, category, search } = req.query;

    const query = {};

    // Brand filter
    if (brand) {
      const brands = brand.split(",");
      query.brand = { $in: brands };
    }

    // Features filter
    if (features) {
      const featArr = features.split(",");
      query.features = { $all: featArr }; // all selected features must be in product
    }

    // Condition filter
    if (condition && condition !== "Any") {
      query.condition = condition;
    }

    // Category filter
    if (category && category !== "All category") {
      query.category = category;
    }

    // Search filter
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i"); // case-insensitive search
      query.name = regex;
    }

    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    console.log("Error fetching products:", err);
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

    const product = new Product({
      name,
      category,
      price,
      discount,
      description,
      img: req.file ? req.file.path : "",
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, category, price, discount, description } = req.body;

    const updateData = { name, category, price, discount, description };

    if (req.file) updateData.img = req.file.path;

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