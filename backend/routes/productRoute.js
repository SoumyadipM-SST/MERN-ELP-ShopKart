const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");

const {
  
  getUserProfile,
  getProducts,
  createProduct,
  getByProductId,
} = require("../controllers/productController");

const {
  fetchProducts,
  addWishlist,
  deleteItemWishList
} = require("../controllers/wishlistController");

const {
  fetchCartProducts,
  addCartItem,
  updateCartQuantity,
  deleteCartItem,
  clearCart,
} = require("../controllers/cartController")

const {create_order, verify_payment} = require("../controllers/paymentController")
const { getMyOrders } = require("../controllers/orderController");


// routes

router.get("/me", authenticate, getUserProfile);

router.post("/products", authenticate, createProduct);

router.get("/products", authenticate, getProducts);

router.get("/products/:id", authenticate, getByProductId);

// wishlist routes

router.get("/wishlist/products", authenticate, fetchProducts);

router.post("/wishlist/:productId", authenticate, addWishlist);

router.delete("/wishlist/delete/:productId", authenticate, deleteItemWishList)

// cart routes

router.get("/cart/products", authenticate, fetchCartProducts)

router.post("/cart/:productId", authenticate, addCartItem)

router.patch("/cart/:productId", authenticate, updateCartQuantity)

router.delete("/cart/delete/:productId", authenticate, deleteCartItem)

router.delete("/cart", authenticate, clearCart)

// payment

router.post("/order", authenticate, create_order)

router.post('/order/verify', authenticate, verify_payment)

router.get("/orders", authenticate, getMyOrders)

module.exports = router;
