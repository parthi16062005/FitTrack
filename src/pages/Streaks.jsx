import { useEffect, useState } from "react";
import { getWorkoutStreak } from "../services/streakService";
import "../style/Streaks.css";

function Streaks() {

    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadStreak();
    }, []);

    const loadStreak = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getWorkoutStreak();
            setStreak(data);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load workout streak."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return "No workouts yet";

        return new Date(`${value}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    if (loading) {
        return (
            <div className="streak-page">
                <div className="streak-message">
                    Loading your streak...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="streak-page">
                <div className="streak-error">{error}</div>

                <button onClick={loadStreak}>
                    Try Again
                </button>
            </div>
        );
    }

    const stats = [
        {
            title: "Current Streak",
            value: streak.current_streak,
            suffix: "Days",
            icon: "🔥",
            color: "orange"
        },
        {
            title: "Longest Streak",
            value: streak.longest_streak,
            suffix: "Days",
            icon: "🏆",
            color: "purple"
        },
        {
            title: "Active Days",
            value: streak.total_active_days,
            suffix: "Days",
            icon: "📅",
            color: "blue"
        }
    ];

    return (
        <div className="streak-page">

            <div className="streak-header">
                <div>
                    <h1>Workout Streaks</h1>
                    <p>
                        Stay consistent and build a stronger fitness habit.
                    </p>
                </div>

                <button
                    className="streak-refresh"
                    onClick={loadStreak}
                >
                    Refresh
                </button>
            </div>

            <div className="streak-hero">

                <div className="streak-flame">🔥</div>

                <div>
                    <span>YOUR CURRENT STREAK</span>

                    <h2>
                        {streak.current_streak} Days
                    </h2>

                    <p>
                        {streak.current_streak > 0
                            ? "Keep going! Consistency is your strength."
                            : "Complete a workout today to start your streak."}
                    </p>
                </div>

            </div>

            <div className="streak-stats">

                {stats.map((item, index) => (

                    <div
                        className={`streak-card ${item.color}`}
                        key={index}
                    >

                        <div className="streak-card-icon">
                            {item.icon}
                        </div>

                        <div>
                            <h3>{item.title}</h3>

                            <strong>{item.value}</strong>

                            <span>{item.suffix}</span>
                        </div>

                    </div>

                ))}

            </div>

            <div className="streak-details">

                <h2>Streak Details</h2>

                <div className="streak-detail-row">
                    <span>Last Workout Date</span>

                    <strong>
                        {formatDate(streak.last_workout_date)}
                    </strong>
                </div>

                <div className="streak-detail-row">
                    <span>Total Active Workout Days</span>

                    <strong>
                        {streak.total_active_days}
                    </strong>
                </div>

                <div className="streak-detail-row">
                    <span>Best Streak</span>

                    <strong>
                        {streak.longest_streak} Days
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default Streaks;