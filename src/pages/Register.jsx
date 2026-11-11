import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

import "../style/Auth.css";


function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // ==========================================
    // HANDLE REGISTRATION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");
            return;

        }

        if (formData.password.length < 8) {

            setError("Password must contain at least 8 characters.");
            return;

        }

        try {

            setLoading(true);

            await registerUser({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // REGISTER PAGE UI
    // ==========================================

    return (

        <div className="auth-container">

            <div className="auth-left">

                <div className="auth-brand">

                    <div className="brand-icon">
                        F
                    </div>

                    <h2>FitTrack</h2>

                </div>

                <div className="auth-hero">

                    <span className="hero-label">
                        YOUR FITNESS JOURNEY
                    </span>

                    <h1>
                        Build Better Habits.
                        <span> Become Stronger.</span>
                    </h1>

                    <p>
                        Track your workouts, monitor your progress
                        and achieve your fitness goals with FitTrack.
                    </p>

                    <div className="hero-stats">

                        <div>
                            <h3>01</h3>
                            <p>Start Today</p>
                        </div>

                        <div>
                            <h3>02</h3>
                            <p>Stay Consistent</p>
                        </div>

                        <div>
                            <h3>03</h3>
                            <p>See Results</p>
                        </div>

                    </div>

                </div>

                <p className="auth-footer">
                    © 2026 FitTrack. All rights reserved.
                </p>

            </div>


            <div className="auth-right">

                <div className="auth-form-wrapper">

                    <span className="form-tag">
                        GET STARTED
                    </span>

                    <h1>Create Account</h1>

                    <p className="form-description">
                        Join FitTrack and start your fitness journey.
                    </p>


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    {success && (

                        <div className="auth-success">
                            {success}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>Username</label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={50}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                maxLength={72}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={8}
                                maxLength={72}
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>

                    </form>


                    <p className="auth-switch">

                        Already have an account?

                        <Link to="/login">
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Register;