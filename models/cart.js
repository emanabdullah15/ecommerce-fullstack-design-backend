const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  qty: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);