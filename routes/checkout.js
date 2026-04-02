const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // create order model

router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, msg: "Cart is empty" });

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Save order to database
    const order = new Order({
      user: req.userId || "guest",
      items,
      total,
    });
    await order.save();

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;