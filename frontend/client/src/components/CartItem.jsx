import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartItem = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, subtotal, totalItems, handlePayment, order, orderPlaced } = useCart();
  const toProducts = () => navigate("/products");

  if (orderPlaced) {
    return (
      <div className="cart-container">
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h1>Order Placed Successfully!</h1>
          <p className="payment-id">Payment ID: <span>{order.paymentId}</span></p>
          
          <div className="order-summary-box">
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.product._id} className="summary-item-row">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-total-row">
              <span>Total Paid</span>
              <span className="total-price">₹{order.total}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={toProducts}>Back to Products</button>
          <button className="btn-secondary" onClick={() => navigate("/orders")}>View My Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-btn" onClick={toProducts}>← Back to Products</button>
        <h1>Shopping Cart ({totalItems})</h1>
        <button className="nav-btn" onClick={() => navigate("/orders")}>My Orders</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="state-message">No items added to cart yet!</div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item-card">
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-price">₹{item.product.price}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)} 
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                  </div>

                  <button className="delete-btn" onClick={() => removeFromCart(item.product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row total-row">
              <span>Subtotal</span>
              <span className="summary-amount">₹{subtotal}/-</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={handlePayment}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;