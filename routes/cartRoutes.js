const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
} = require("../controllers/cartController");

// ROUTES
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);
router.delete("/", clearCart);

module.exports = router;