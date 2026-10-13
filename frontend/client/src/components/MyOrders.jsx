import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:8000/customer/orders",
      { withCredentials: true },
    );
    return response.data.orders;
  }, []);

  useEffect(() => {
    let active = true;
    fetchOrders()
      .then((loadedOrders) => {
        if (active) setOrders(loadedOrders);
      })
      .catch((requestError) => {
        console.error(requestError);
        if (active) {
          setError(
            requestError.response?.data?.message || "Unable to load your orders",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchOrders]);

  const retryFetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await fetchOrders());
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message || "Unable to load your orders",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="orders-container">
      <header className="orders-header">
        <div>
          <p className="orders-eyebrow">Your account</p>
          <h1>My Orders</h1>
          <p className="orders-subtitle">View your purchases and payment details.</p>
        </div>
        <button className="nav-btn" onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </header>

      {loading && <div className="state-message">Loading your orders...</div>}

      {!loading && error && (
        <div>
          <p className="error-message">{error}</p>
          <button className="btn-primary" onClick={retryFetchOrders}>Try Again</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="orders-empty state-message">
          <h2>No orders yet</h2>
          <p>Your completed purchases will appear here.</p>
          <button className="btn-primary" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <section className="orders-list" aria-label="Order history">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <header className="order-card-header">
                <div>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                  <p className="order-payment-id">Payment ID: {order.paymentId}</p>
                </div>
                <span className="order-status">{order.status}</span>
              </header>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={`${order._id}-${item.product}-${item.name}`}
                  >
                    {item.image && (
                      <img className="order-item-image" src={item.image} alt="" />
                    )}
                    <div className="order-item-details">
                      <h2>{item.name}</h2>
                      <p>Qty: {item.quantity} · {formatCurrency(item.price)} each</p>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <footer className="order-card-footer">
                <span>{order.items.reduce((count, item) => count + item.quantity, 0)} items</span>
                <strong>Total paid: {formatCurrency(order.total)}</strong>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyOrders;
