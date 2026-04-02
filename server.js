require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const ordersRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB from .env
const mongoURI = process.env.MONGO_URI; // your .env should have MONGO_URI="mongodb+srv://..."
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Serve images from frontend public folder
app.use(
  "/images",
  express.static(path.join(__dirname, "..","frontend", "public", "images"))
);

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/orders", require("./routes/order"));
app.use("/api/orders", ordersRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));