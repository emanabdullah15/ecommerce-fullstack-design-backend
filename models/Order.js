const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  name: String,
  address: String,
  phone: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);