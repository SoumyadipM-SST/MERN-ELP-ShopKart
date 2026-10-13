const userModel = require("../model/userModel");
const productModel = require("../model/productModel");

const fetchProducts = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const user = await userModel
      .findById(user_id)
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Successfully retrieved",
      products: user.wishlist,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addWishlist = async (req, res) => {
  try {
    const product_id = req.params.productId;
    if (!product_id) {
      return res.status(400).json({
        message: "Product id not found",
      });
    }
    const product = await productModel.findById(product_id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const check = user.wishlist.some(
      (item) => item.toString() === product_id
    );
    if (check) {
      return res.status(409).json({
        message: "Product already in wishlist",
      });
    }
    user.wishlist.push(product_id);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteItemWishList = async (req, res)=>{
  try{
    const product_id = req.params.productId;
    if(!product_id){
      return res.status(400).json({
        message: "Product id not found",
      });
    }
    const product = await productModel.findById(product_id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // delete the product_id from the products array of wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== product_id
    );
    await user.save()
    return res.status(200).json({
      message: "Product removed from wishlist",
      products: user.wishlist,
    });
  } catch(error){
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


module.exports = {
  fetchProducts,
  addWishlist,
  deleteItemWishList,
}
