const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const products = [
  {
    name: "Smart Watch",
    category: "Tech",
    price: 19,
    discount: "-25%",
    img: "/images/tech/8.jpg",
    description: "Smart watch with multiple features",
  },
  {
    name: "Laptop",
    category: "Tech",
    price: 499,
    discount: "-15%",
    img: "/images/tech/7.jpg",
    description: "High performance laptop",
  },
  {
    name: "GoPro Camera",
    category: "Tech",
    price: 250,
    discount: "-40%",
    img: "/images/tech/6.jpg",
    description: "Waterproof GoPro camera",
  },
  {
    name: "Headphones",
    category: "Tech",
    price: 29,
    discount: "-25%",
    img: "/images/tech/5.jpg",
    description: "Noise cancelling headphones",
  },
];

const importData = async () => {
  try {
    await Product.deleteMany(); // purane products remove
    await Product.insertMany(products);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();