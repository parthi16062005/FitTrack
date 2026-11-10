import { useEffect, useState } from "react";

import {
    getPersonalizedDashboard
} from "../services/personalizedDashboardService";

import "../style/PersonalizedDashboard.css";


function PersonalizedDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getPersonalizedDashboard();

            setDashboard(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load personalized dashboard."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (value) => {

        if (!value) return "N/A";

        return new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="personal-dashboard">
                <div className="personal-loading">
                    Loading your fitness dashboard...
                </div>
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="personal-dashboard">

                <div className="personal-error">
                    {error}
                </div>

                <button
                    className="personal-refresh"
                    onClick={loadDashboard}
                >
                    Try Again
                </button>

            </div>
        );

    }


    const statistics = [

        {
            title: "Total Workouts",
            value: dashboard.total_workouts,
            icon: "🏋️",
            color: "workout"
        },

        {
            title: "Calories Burned",
            value: dashboard.total_calories,
            icon: "🔥",
            color: "calories"
        },

        {
            title: "Workout Duration",
            value: dashboard.total_duration,
            suffix: " min",
            icon: "⏱️",
            color: "duration"
        },

        {
            title: "Achievement Badges",
            value: dashboard.total_badges,
            icon: "🏆",
            color: "badges"
        }

    ];


    return (

        <div className="personal-dashboard">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="personal-header">

                <div>

                    <h1>
                        Welcome back, {dashboard.username}!
                    </h1>

                    <p>
                        Here's your personalized fitness overview.
                    </p>

                </div>

                <button
                    className="personal-refresh"
                    onClick={loadDashboard}
                >
                    Refresh
                </button>

            </div>


            {/* ==================================
                FITNESS STATISTICS
            ================================== */}

            <div className="personal-stats-grid">

                {statistics.map((item, index) => (

                    <div
                        className={`personal-stat-card ${item.color}`}
                        key={index}
                    >

                        <div className="personal-stat-icon">
                            {item.icon}
                        </div>

                        <div>

                            <p>{item.title}</p>

                            <h2>
                                {Number(item.value).toLocaleString("en-IN")}
                                {item.suffix || ""}
                            </h2>

                        </div>

                    </div>

                ))}

            </div>


            {/* ==================================
                FITNESS OVERVIEW
            ================================== */}

            <div className="personal-overview-grid">

                {/* GOAL PROGRESS */}

                <div className="personal-panel">

                    <h2>Goal Progress</h2>

                    <div className="personal-goal-number">

                        <strong>
                            {dashboard.completed_goals}
                        </strong>

                        <span>
                            / {dashboard.total_goals} Goals Completed
                        </span>

                    </div>

                    <div className="personal-progress-bar">

                        <div
                            className="personal-progress-fill"
                            style={{
                                width: `${dashboard.goal_completion_percentage}%`
                            }}
                        />

                    </div>

                    <p className="personal-progress-text">

                        {dashboard.goal_completion_percentage}% completion

                    </p>

                </div>


                {/* STREAK OVERVIEW */}

                <div className="personal-panel">

                    <h2>Workout Streak</h2>

                    <div className="personal-streak-grid">

                        <div className="personal-streak-item">

                            <span>🔥</span>

                            <h3>
                                {dashboard.current_streak}
                            </h3>

                            <p>Current Streak</p>

                        </div>

                        <div className="personal-streak-item">

                            <span>🏆</span>

                            <h3>
                                {dashboard.longest_streak}
                            </h3>

                            <p>Longest Streak</p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                RECENT WORKOUTS
            ================================== */}

            <div className="personal-panel personal-recent-panel">

                <div className="personal-section-header">

                    <h2>Recent Workouts</h2>

                    <span>
                        Latest 5 activities
                    </span>

                </div>


                {dashboard.recent_workouts.length === 0 ? (

                    <div className="personal-empty">

                        <span>🏋️</span>

                        <p>No workouts recorded yet.</p>

                    </div>

                ) : (

                    <div className="personal-table-wrapper">

                        <table className="personal-workout-table">

                            <thead>

                                <tr>
                                    <th>Workout</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    <th>Calories</th>
                                    <th>Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.recent_workouts.map(workout => (

                                    <tr key={workout.id}>

                                        <td>
                                            <strong>
                                                {workout.workout_name}
                                            </strong>
                                        </td>

                                        <td>
                                            {workout.category}
                                        </td>

                                        <td>
                                            {workout.duration} min
                                        </td>

                                        <td>
                                            {workout.calories_burned} kcal
                                        </td>

                                        <td>
                                            {formatDate(workout.workout_date)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default PersonalizedDashboard;