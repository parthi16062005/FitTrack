import { useEffect, useState } from "react";
import { getAchievements } from "../services/achievementService";
import "../style/Achievements.css";

function Achievements() {

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAchievements();
            setAchievements(data);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load achievements."
            );
        } finally {
            setLoading(false);
        }
    };

    const availableBadges = [
        {
            code: "FIRST_WORKOUT",
            name: "First Workout",
            description: "Complete your first workout.",
            icon: "🏅"
        },
        {
            code: "TEN_WORKOUTS",
            name: "Fitness Beginner",
            description: "Complete 10 workouts.",
            icon: "🥉"
        },
        {
            code: "FIFTY_WORKOUTS",
            name: "Fitness Champion",
            description: "Complete 50 workouts.",
            icon: "🏆"
        },
        {
            code: "SEVEN_DAY_STREAK",
            name: "7 Day Streak",
            description: "Maintain a 7-day workout streak.",
            icon: "🔥"
        },
        {
            code: "THIRTY_DAY_STREAK",
            name: "30 Day Streak",
            description: "Maintain a 30-day workout streak.",
            icon: "💎"
        },
        {
            code: "GOAL_ACHIEVER",
            name: "Goal Achiever",
            description: "Complete your first fitness goal.",
            icon: "🎯"
        }
    ];

    if (loading) {
        return (
            <div className="achievements-page">
                <p className="achievement-message">
                    Loading achievements...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="achievements-page">
                <p className="achievement-error">{error}</p>

                <button onClick={loadAchievements}>
                    Try Again
                </button>
            </div>
        );
    }

    const earnedCodes = new Set(
        achievements.map(item => item.badge_code)
    );

    return (
        <div className="achievements-page">

            <div className="achievements-header">

                <div>
                    <h1>Achievement Badges</h1>

                    <p>
                        Celebrate your fitness milestones and achievements.
                    </p>
                </div>

                <button
                    className="achievement-refresh"
                    onClick={loadAchievements}
                >
                    Refresh
                </button>

            </div>

            <div className="achievement-summary">

                <div>
                    <span>Total Badges Earned</span>

                    <h2>
                        {achievements.length} / {availableBadges.length}
                    </h2>
                </div>

                <div>
                    <span>Completion Rate</span>

                    <h2>
                        {Math.round(
                            (achievements.length / availableBadges.length) * 100
                        )}%
                    </h2>
                </div>

            </div>

            <div className="achievement-progress">

                <div
                    className="achievement-progress-fill"
                    style={{
                        width: `${(
                            achievements.length / availableBadges.length
                        ) * 100}%`
                    }}
                />

            </div>

            <h2 className="achievement-section-title">
                Your Badges
            </h2>

            <div className="achievement-grid">

                {availableBadges.map(badge => {

                    const earned = earnedCodes.has(badge.code);

                    const earnedBadge = achievements.find(
                        item => item.badge_code === badge.code
                    );

                    return (

                        <div
                            className={`achievement-card ${
                                earned ? "earned" : "locked"
                            }`}
                            key={badge.code}
                        >

                            <div className="achievement-icon">
                                {badge.icon}
                            </div>

                            <h3>{badge.name}</h3>

                            <p>{badge.description}</p>

                            <span
                                className={`achievement-status ${
                                    earned ? "unlocked" : "locked-status"
                                }`}
                            >
                                {earned ? "Unlocked" : "Locked"}
                            </span>

                            {earned && earnedBadge && (
                                <small>
                                    Earned: {new Date(
                                        earnedBadge.earned_at
                                    ).toLocaleDateString("en-IN")}
                                </small>
                            )}

                        </div>

                    );

                })}

            </div>

        </div>
    );
}

export default Achievements;