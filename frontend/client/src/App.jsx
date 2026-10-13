import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProductDetails from "./components/ProductDetails";
import Products from "./components/Products";
import Home from "./components/Home";
import WishList from "./components/WishList";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import CartItem from "./components/CartItem";
import MyOrders from "./components/MyOrders";
import './index.css';

const App = () => {
    return (
        <Routes>

            <Route element={<PublicRoute />}>
                <Route
                    path="/login"
                    element={<LoginForm />}
                />

                <Route
                    path="/register"
                    element={<RegisterForm />}
                />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />
                <Route
                    path="/wishlist"
                    element={<WishList />}
                />
                <Route
                    path="/cart"
                    element={<CartItem/>}
                />
                <Route
                    path="/orders"
                    element={<MyOrders />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
};

export default App;