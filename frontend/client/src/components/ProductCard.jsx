import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
                <span className="product-category-badge">{product.category}</span>
            </div>

            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>

                <div className="product-meta">
                    <span className="product-price">₹{product.price}</span>
                    <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                </div>

                <button
                    className="btn-card"
                    onClick={() => navigate(`/products/${product._id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;