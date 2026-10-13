import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="home-container">
            <div className="home-hero-card">
                <span className="home-badge">Welcome Back</span>
                <h1 className="home-title">Discover Exclusive Collections</h1>
                <p className="home-description">
                    Explore high-quality products tailored to your preferences in our modern catalog.
                </p>

                <div className="home-actions">
                    <button className="btn-primary home-btn" onClick={() => navigate('/products')}>
                        Browse Products →
                    </button>
                    <button className="btn-secondary home-btn" onClick={() => navigate('/orders')}>
                        My Orders
                    </button>
                    <button className="btn-secondary home-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;