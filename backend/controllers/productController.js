const mongoose = require("mongoose");

const userModel = require("../model/userModel");
const productModel = require("../model/productModel");

const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const user = await userModel.findById(user_id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Welcome user to your profile",
      user: user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    if (search && search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }
    if (category && category.trim()) {
      query.category = category.trim();
    }
    const products = await productModel.find(query);
    return res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Missing required field",
      });
    }
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        message: "Invalid stock",
      });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getUserProfile,
  getProducts,
  createProduct,
  getByProductId,
};