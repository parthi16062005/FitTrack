
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

import "../style/Auth.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // Handle login
    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        if (!formData.username.trim() || !formData.password) {
            setError("Please enter your username and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await loginUser({
                username: formData.username.trim(),
                password: formData.password,
            });

            // Store authentication token
            localStorage.setItem(
                "fittrack_token",
                response.access_token
            );

            // Store user details
            localStorage.setItem(
                "fittrack_user",
                JSON.stringify(response.user)
            );

            navigate("/dashboard", { replace: true });

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to login. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            {/* LEFT BRAND SECTION */}

            <div className="login-brand-section">

                <div className="login-brand">

                    <div className="login-brand-icon">
                        F
                    </div>

                    <span>FitTrack</span>

                </div>

                <div className="login-brand-bottom">
                    <span>FITNESS MANAGEMENT PLATFORM</span>
                </div>

                <p className="login-copyright">
                    © 2026 FitTrack. All rights reserved.
                </p>

            </div>


            {/* RIGHT LOGIN SECTION */}

            <div className="login-form-section">

                <div className="login-card">

                    <div className="login-card-header">

                        <div className="login-icon">
                            F
                        </div>

                        <span className="login-label">
                            ACCOUNT ACCESS
                        </span>

                        <h1>Welcome Back</h1>

                        <p>
                            Sign in to access your FitTrack account.
                        </p>

                    </div>


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    {/* LOGIN FORM */}

                    <form onSubmit={handleSubmit}>

                        <div className="login-input-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={50}
                                autoComplete="username"
                                required
                            />

                        </div>


                        <div className="login-input-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="login-password-wrapper">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="login-submit-button"
                            disabled={loading}
                        >

                            {loading ? "Signing In..." : "Sign In"}

                        </button>

                    </form>


                    {/* REGISTER LINK */}

                    <div className="login-register-link">

                        Don't have an account?

                        <Link to="/register">
                            Create Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;
