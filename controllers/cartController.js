const Cart = require("../models/cart");

// GET ALL CART ITEMS
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { name, price, img, qty } = req.body;

    const item = new Cart({
      name,
      price,
      img,
      qty: qty || 1,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QTY
exports.updateCart = async (req, res) => {
  try {
    const { qty } = req.body;

    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ITEM
exports.deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ALL
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};