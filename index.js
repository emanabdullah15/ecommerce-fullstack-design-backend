const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cartRoutes");

const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://emanabdullah467_db_user:nc8SMGZYqQVQl0AU@ac-eeja7wt-shard-00-00.k6y4lle.mongodb.net:27017,ac-eeja7wt-shard-00-01.k6y4lle.mongodb.net:27017,ac-eeja7wt-shard-00-02.k6y4lle.mongodb.net:27017/ecommerceDB?ssl=true&replicaSet=atlas-w6r8ax-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB Error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/auth", authRoutes); 

// Test Route
app.get("/", (req, res) => res.send("API running..."));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));