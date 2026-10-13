const userModel = require("../model/userModel");
const productModel = require("../model/productModel");

const fetchCartProducts = async (req, res) => {
    try {
        const user_id = req.user.id;

        if (!user_id) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }
        const user = await userModel
            .findById(user_id)
            .populate("cart.product");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Successfully retrieved",
            cart: user.cart,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const addCartItem = async (req, res) => {
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
        const cartItem = user.cart.find(
            item => item.product.toString() === product_id
        );

        if (cartItem) {
            if (cartItem.quantity < product.stock)
                cartItem.quantity += 1;
            else
                return res.status(400).json({
                    message: "Quantity exceeds available stock",
                });
        } else {
            if (product.stock < 1) {
                return res.status(400).json({
                    message: "Product is out of stock",
                });
            }
            user.cart.push({
                product: product_id,
                quantity: 1,
            });
        }
        await user.save();
        const updatedUser = await userModel
            .findById(user_id)
            .populate("cart.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedUser.cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { quantity } = req.body;

        const userId = req.user.id;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Invalid quantity",
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Quantity exceeds available stock",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not in cart",
            });
        }
        cartItem.quantity = quantity;
        await user.save();
        const updatedUser = await userModel
            .findById(userId)
            .populate("cart.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedUser.cart,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const deleteCartItem = async (req, res) => {
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
        // delete the product_id from the products array of wishlist
        user.cart = user.cart.filter(
            (item) => item.product.toString() !== product_id
        );
        await user.save()
        const updatedUser = await userModel
            .findById(user_id)
            .populate("cart.product");

        return res.status(200).json({
            message: "Product removed from cart",
            cart: updatedUser.cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

const clearCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = [];
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: [],
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    fetchCartProducts,
    addCartItem,
    updateCartQuantity,
    deleteCartItem,
    clearCart,
}
