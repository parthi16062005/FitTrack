import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../services/api";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // VERIFY LOGGED-IN USER
    // ==========================================

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await getCurrentUser();

                setUser(response);

                localStorage.setItem(
                    "fittrack_user",
                    JSON.stringify(response)
                );

            } catch (error) {

                localStorage.removeItem("fittrack_token");
                localStorage.removeItem("fittrack_user");

                navigate("/login", { replace: true });

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, [navigate]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div style={{ padding: "40px" }}>
                Loading dashboard...
            </div>
        );

    }


    if (!user) {
        return null;
    }


    // ==========================================
    // DASHBOARD UI
    // ==========================================

    return (

        <div style={{
            minHeight: "100vh",
            background: "#f5f8f5",
            padding: "40px",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box"
        }}>

            {/* PAGE HEADER */}

            <div style={{
                marginBottom: "35px"
            }}>

                <h1 style={{
                    color: "#17251c",
                    fontSize: "30px",
                    marginBottom: "10px"
                }}>
                    Dashboard
                </h1>

                <p style={{
                    color: "#849087",
                    fontSize: "15px"
                }}>
                    Welcome back, {user.username}! Here's your fitness overview.
                </p>

            </div>


            {/* WELCOME CARD */}

            <div style={{
                background: "#101c18",
                padding: "35px",
                borderRadius: "15px",
                color: "#ffffff",
                marginBottom: "30px"
            }}>

                <h2 style={{
                    fontSize: "24px",
                    marginBottom: "12px"
                }}>
                    Welcome to FitTrack
                </h2>

                <p style={{
                    color: "#c4d1c8",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    maxWidth: "600px"
                }}>
                    Stay consistent with your fitness journey.
                    Track your workouts, monitor daily progress
                    and work towards your fitness goals.
                </p>

                <button
                    onClick={() => navigate("/workouts")}
                    style={{
                        background: "#a3e635",
                        color: "#101c18",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: "7px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "15px"
                    }}
                >
                    Start Workout
                </button>

            </div>


            {/* ACCOUNT INFORMATION */}

            <div style={{
                background: "#ffffff",
                padding: "30px",
                borderRadius: "14px",
                border: "1px solid #e5ebe5",
                boxShadow: "0 5px 20px rgba(0,0,0,0.03)"
            }}>

                <h2 style={{
                    color: "#17251c",
                    marginBottom: "25px"
                }}>
                    Account Information
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "25px"
                }}>

                    <div>
                        <p style={{ color: "#849087", fontSize: "13px" }}>
                            Username
                        </p>

                        <strong>{user.username}</strong>
                    </div>

                    <div>
                        <p style={{ color: "#849087", fontSize: "13px" }}>
                            Email Address
                        </p>

                        <strong>{user.email}</strong>
                    </div>

                    <div>
                        <p style={{ color: "#849087", fontSize: "13px" }}>
                            User ID
                        </p>

                        <strong>{user.id}</strong>
                    </div>

                </div>

                <div style={{
                    marginTop: "25px",
                    padding: "12px",
                    background: "#f0fdf4",
                    color: "#15803d",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600"
                }}>
                    Authentication Successful
                </div>

            </div>

        </div>

    );

}

export default Dashboard;