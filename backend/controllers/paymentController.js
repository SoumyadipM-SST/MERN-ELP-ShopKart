const Razorpay = require('razorpay');
const crypto = require('crypto');
const userModel = require('../model/userModel');
const productModel = require('../model/productModel');
const orderModel = require('../model/orderModel');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API,
  key_secret: process.env.RAZORPAY_SECRET,
});

const create_order = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

const verify_payment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const existingOrder = await orderModel.findOne({
      user: req.user.id,
      razorpayOrderId: razorpay_order_id,
    });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    const user = await userModel.findById(req.user.id).populate("cart.product");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No cart items found for this order",
      });
    }

    const orderItems = user.cart.map((item) => {
      if (!item.product) {
        throw new Error("A product in the cart could not be found");
      }

      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const stockUpdates = orderItems.map((item) =>
      productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      }),
    );
    await Promise.all(stockUpdates);

    const savedOrder = await orderModel.create({
      user: req.user.id,
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      items: orderItems,
      total,
    });

    await userModel.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and product stock updated",
      order: savedOrder,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  create_order,
  verify_payment,
};