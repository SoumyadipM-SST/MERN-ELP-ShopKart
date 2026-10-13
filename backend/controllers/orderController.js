const orderModel = require("../model/orderModel");

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders",
    });
  }
};

module.exports = { getMyOrders };
