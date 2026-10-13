import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import axios from 'axios';
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchCart, orderPlaced, startNewOrder } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProductById(id);
                setProduct(data.product);
            } catch (err) {
                console.log(err);
                setError("Something went wrong while loading the product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="state-message">Loading product details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="state-message">Product not found.</div>;
    }

    const addToWishlist = async (id) => {
        try {
            await axios.post(`http://localhost:8000/customer/wishlist/${id}`, {}, { 
                withCredentials: true,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const addToCart = async (id) => {
        try {
            if (orderPlaced && !(await startNewOrder())) {
                return;
            }
            await axios.post(`http://localhost:8000/customer/cart/${id}`, {}, { 
                withCredentials: true,
            });
            await fetchCart();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="product-details-container">
            <button className="back-btn" onClick={() => navigate("/products")}>
                ← Back to Products
            </button>

            <div className="product-details-card">
                <div className="details-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="details-image"
                    />
                </div>

                <div className="details-info-section">
                    <span className="details-category">{product.category}</span>
                    <h1 className="details-title">{product.name}</h1>
                    <p className="details-description">{product.description}</p>

                    <div className="details-meta">
                        <span className="details-price">₹{product.price}</span>
                        <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} units left)` : "Out of stock"}
                        </span>
                    </div>

                    <div className="details-actions">
                        <button className="btn-cart" onClick={() => addToCart(id)}>
                            Add to Cart
                        </button>
                        <button className="btn-wishlist" onClick={() => addToWishlist(id)}>
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;