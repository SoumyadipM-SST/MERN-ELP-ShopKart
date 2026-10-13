import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const [products, setProducts] = useState([]);
  const [err, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/customer/wishlist/products",
          { withCredentials: true }
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
        setError("Unable to load wishlist");
      }
    };

    fetchProducts();
  }, []);

  const deleteItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8000/customer/wishlist/delete/${productId}`,
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.log(error);
      setError("Unable to delete item");
    }
  };

  if (err) {
    return <div className="error-message">{err}</div>;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <button className="back-btn" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>
        <h1>Your Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="state-message">No items in your wishlist yet!</div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
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

                <div className="wishlist-card-actions">
                  <button
                    className="btn-card"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;