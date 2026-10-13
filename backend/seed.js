require("dotenv").config();
const mongoose = require("mongoose");

// Adjust relative path to your Product model file if needed
const Product = require("./model/productModel");

const sampleProducts = [
  // ================= ELECTRONICS (5) =================
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "High-fidelity audio with active noise cancellation and up to 30 hours of battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 25
  },
  {
    name: "Minimalist Smart Watch",
    description: "Sleek fitness tracking smartwatch with heart rate monitoring, GPS, and custom watch faces.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 15
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof wireless speaker delivering deep bass and 12-hour continuous playback.",
    price: 1999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    stock: 30
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches for high-performance typing.",
    price: 3499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 12
  },
  {
    name: "4K Action Camera",
    description: "Ultra HD action camera with dual screen, waterproof casing, and wide-angle stabilization.",
    price: 6499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    stock: 8
  },

  // ================= FASHION (5) =================
  {
    name: "Classic Leather Jacket",
    description: "Premium handcrafted genuine leather jacket designed for modern style and durability.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    stock: 10
  },
  {
    name: "Urban Denim Jacket",
    description: "Timeless indigo denim jacket built with soft stretch cotton for all-day comfortable wear.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    stock: 18
  },
  {
    name: "Casual Canvas Sneakers",
    description: "Lightweight unisex low-top sneakers featuring breathable fabric and durable rubber soles.",
    price: 1799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    stock: 22
  },
  {
    name: "Polarized Retro Sunglasses",
    description: "UV400 protection polarized lenses set in a sturdy, stylish matte metal frame.",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Minimalist Leather Backpack",
    description: "Elegant daily commuter bag featuring a padded laptop sleeve and quick-access pockets.",
    price: 2899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stock: 14
  },

  // ================= BOOKS (5) =================
  {
    name: "Atomic Habits - James Clear",
    description: "An easy & proven way to build good habits and break bad ones. Hardcover edition.",
    price: 599,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    name: "Deep Work - Cal Newport",
    description: "Rules for focused success in a distracted world. Master complex skills efficiently.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    stock: 35
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel.",
    price: 450,
    category: "Books",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    stock: 45
  },
  {
    name: "Thinking, Fast and Slow",
    description: "Daniel Kahneman's ground-breaking exploration of how human judgment works.",
    price: 650,
    category: "Books",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    stock: 20
  },
  {
    name: "Zero to One - Peter Thiel",
    description: "Notes on startups, or how to build the future. Insightful guide for modern entrepreneurs.",
    price: 420,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    stock: 30
  },

  // ================= HOME (5) =================
  {
    name: "Modern Ceramic Table Lamp",
    description: "Warm ambient lighting with a textured ceramic base and linen shade for cozy home interiors.",
    price: 1899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stock: 18
  },
  {
    name: "Essential Oil Aroma Diffuser",
    description: "Ultrasonic mist humidifier with 7 color LED lights and automatic shut-off safety mode.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    stock: 25
  },
  {
    name: "Scented Soy Wax Candles",
    description: "Set of 3 hand-poured lavender and vanilla soy candles with wooden wicks.",
    price: 799,
    category: "Home",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    stock: 40
  },
  {
    name: "Handwoven Cotton Throw Blanket",
    description: "Ultra-soft breathable cotton sofa throw for cozy living room decor.",
    price: 1499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    stock: 15
  },
  {
    name: "Minimalist Wall Clock",
    description: "Silent non-ticking quartz movement wall clock in modern Scandinavian design.",
    price: 999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
    stock: 20
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO;

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} products across 4 categories!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();