import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the specific field error when the user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation (8+ chars, 1 upper, 1 lower, 1 digit, 1 special)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must be 8+ chars with at least 1 upper, 1 lower, 1 number, and 1 symbol (@$!%*?&).";
    }

    // Phone validation (min 10 digits starting with 6, 7, 8, or 9)
    const cleanPhone = formData.phone.replace(/\s+/g, "");
    const phoneRegex = /^[6-9]\d{9,}$/;
    if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Must be at least 10 digits and start with 6, 7, 8, or 9.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Run frontend validation first
    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post('http://localhost:8000/auth/register', formData);
      navigate("/login");
    } catch (error) {
      setServerError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start shopping</p>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            style={errors.fullName ? { borderColor: '#dc2626' } : {}}
          />
          {errors.fullName && (
            <span style={{ color: '#dc2626', fontSize: '0.825rem', marginTop: '0.35rem', fontWeight: '500' }}>
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            style={errors.email ? { borderColor: '#dc2626' } : {}}
          />
          {errors.email && (
            <span style={{ color: '#dc2626', fontSize: '0.825rem', marginTop: '0.35rem', fontWeight: '500' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={errors.password ? { borderColor: '#dc2626' } : {}}
          />
          {errors.password && (
            <span style={{ color: '#dc2626', fontSize: '0.825rem', marginTop: '0.35rem', fontWeight: '500' }}>
              {errors.password}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            required
            style={errors.phone ? { borderColor: '#dc2626' } : {}}
          />
          {errors.phone && (
            <span style={{ color: '#dc2626', fontSize: '0.825rem', marginTop: '0.35rem', fontWeight: '500' }}>
              {errors.phone}
            </span>
          )}
        </div>

        {/* Uses your existing .error-message CSS class */}
        {serverError && <div className="error-message">{serverError}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;