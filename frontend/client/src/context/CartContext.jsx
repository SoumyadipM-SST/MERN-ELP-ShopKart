import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8000/customer/cart/products",
        {
          withCredentials: true,
        },
      );

      setCartItems(response.data.cart);
    } catch (error) {
      console.log(error);
      setError("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/customer/cart/${productId}`,
        {
          quantity,
        },
        {
          withCredentials: true,
        },
      );
      setCartItems(response.data.cart);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to update cart");
    }
  };
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/customer/cart/delete/${productId}`,
        {
          withCredentials: true,
        },
      );

      setCartItems(response.data.cart);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to remove item");
    }
  };
  const resetOrder = () => {
    setOrder(null);
    setOrderPlaced(false);
  };

  const startNewOrder = async () => {
    try {
      const response = await axios.delete("http://localhost:8000/customer/cart", {
        withCredentials: true,
      });
      setCartItems(response.data.cart);
      resetOrder();
      return true;
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to start a new order");
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:8000/customer/order",
        {
          amount: subtotal,
        },
        {
          withCredentials: true,
        },
      );

      const razorpayOrder = response.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Your Store",
        description: "Cart Payment",
        order_id: razorpayOrder.id,
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:8000/customer/order/verify",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              { withCredentials: true },
            );

            console.log("Payment verified:", verifyResponse.data);
            setOrder({
              paymentId: paymentResponse.razorpay_payment_id,
              items: [...cartItems],
              total: subtotal,
            });
            setCartItems([]);
            setOrderPlaced(true);
          } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#3399cc" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to initiate payment");
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, loading, error, fetchCart, updateQuantity, removeFromCart, totalItems, subtotal, handlePayment, order, orderPlaced, resetOrder, startNewOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
