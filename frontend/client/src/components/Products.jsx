import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProducts({ search, category });
                setProducts(data.products);
            } catch (err) {
                console.log(err);
                setError("Something went wrong while loading products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category]);

    return (
        <div className="products-page">
            <header className="products-header">
                <div className="header-title-section">
                    <h1>Explore Products</h1>
                    <p className="header-subtitle">Discover our premium dark collection</p>
                </div>

                <nav className="header-actions">
                    <button className="nav-btn" onClick={() => navigate('/home')}>Home</button>
                    <button className="nav-btn" onClick={() => navigate('/wishlist')}>Wishlist</button>
                    <button className="nav-btn" onClick={() => navigate('/orders')}>My Orders</button>
                    <button className="nav-btn nav-btn-primary" onClick={() => navigate('/cart')}>Cart</button>
                </nav>
            </header>

            <div className="search-section">
                <SearchBar
                    search={search}
                    category={category}
                    setSearch={setSearch}
                    setCategory={setCategory}
                />
            </div>

            {loading && <div className="state-message">Loading products...</div>}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && products.length === 0 && (
                <div className="state-message">No products found.</div>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;