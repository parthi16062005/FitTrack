import { useEffect, useState } from "react";

import {
    getWeeklyComparison,
    getMonthlyComparison
} from "../services/progressComparisonService";

import "../style/ProgressComparison.css";


function ProgressComparison() {

    const [comparisonType, setComparisonType] = useState("weekly");

    const [comparison, setComparison] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD COMPARISON DATA
    // ==========================================

    const loadComparison = async (type) => {

        try {

            setLoading(true);
            setError("");

            const data = type === "weekly"
                ? await getWeeklyComparison()
                : await getMonthlyComparison();

            setComparison(data);

        } catch (err) {

            console.error("Comparison loading error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load progress comparison."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadComparison(comparisonType);

    }, [comparisonType]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (value) => {

        return new Date(value).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const statistics = comparison ? [

        {
            title: "Total Workouts",
            current: comparison.current_period.total_workouts,
            previous: comparison.previous_period.total_workouts,
            change: comparison.workout_change,
            unit: "workouts"
        },

        {
            title: "Workout Duration",
            current: comparison.current_period.total_duration,
            previous: comparison.previous_period.total_duration,
            change: comparison.duration_change,
            unit: "minutes"
        },

        {
            title: "Calories Burned",
            current: comparison.current_period.total_calories,
            previous: comparison.previous_period.total_calories,
            change: comparison.calories_change,
            unit: "kcal"
        }

    ] : [];


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="comparison-page">

            {/* HEADER */}

            <div className="comparison-header">

                <div>
                    <h1>Progress Comparison</h1>

                    <p>
                        Compare your fitness performance
                        and track your improvements.
                    </p>
                </div>

                <div className="comparison-selector">

                    <button
                        className={
                            comparisonType === "weekly"
                                ? "comparison-tab active"
                                : "comparison-tab"
                        }
                        onClick={() => setComparisonType("weekly")}
                    >
                        Weekly
                    </button>

                    <button
                        className={
                            comparisonType === "monthly"
                                ? "comparison-tab active"
                                : "comparison-tab"
                        }
                        onClick={() => setComparisonType("monthly")}
                    >
                        Monthly
                    </button>

                </div>

            </div>


            {/* LOADING */}

            {loading && (

                <div className="comparison-message">
                    Loading comparison data...
                </div>

            )}


            {/* ERROR */}

            {!loading && error && (

                <div className="comparison-error">
                    {error}
                </div>

            )}


            {/* COMPARISON CONTENT */}

            {!loading && !error && comparison && (

                <>

                    {/* PERIOD CARDS */}

                    <div className="comparison-periods">

                        <div className="period-card current-period">

                            <span>Current Period</span>

                            <h3>
                                {formatDate(
                                    comparison.current_period.period_start
                                )}
                            </h3>

                            <p>
                                to{" "}
                                {formatDate(
                                    comparison.current_period.period_end
                                )}
                            </p>

                        </div>


                        <div className="period-card previous-period">

                            <span>Previous Period</span>

                            <h3>
                                {formatDate(
                                    comparison.previous_period.period_start
                                )}
                            </h3>

                            <p>
                                to{" "}
                                {formatDate(
                                    comparison.previous_period.period_end
                                )}
                            </p>

                        </div>

                    </div>


                    {/* STATISTICS */}

                    <div className="comparison-statistics">

                        {statistics.map((item) => {

                            const percentage = Number(item.change) || 0;

                            const isPositive = percentage > 0;

                            const isNegative = percentage < 0;

                            return (

                                <div
                                    className="comparison-stat-card"
                                    key={item.title}
                                >

                                    <h3>{item.title}</h3>

                                    <div className="stat-values">

                                        <div>
                                            <span>Current</span>

                                            <strong>
                                                {item.current}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Previous</span>

                                            <strong>
                                                {item.previous}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="comparison-progress">

                                        <div className="comparison-progress-label">

                                            <span>Current performance</span>

                                            <strong>
                                                {item.current} {item.unit}
                                            </strong>

                                        </div>

                                        <div className="comparison-progress-track">

                                            <div
                                                className="comparison-progress-fill"
                                                style={{
                                                    width: `${
                                                        item.current > 0
                                                            ? Math.max(
                                                                3,
                                                                Math.min(
                                                                    100,
                                                                    item.previous > 0
                                                                        ? item.current / Math.max(item.current, item.previous) * 100
                                                                        : 100
                                                                )
                                                            )
                                                            : 0
                                                    }%`
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div className={
                                        isPositive
                                            ? "comparison-change positive"
                                            : isNegative
                                                ? "comparison-change negative"
                                                : "comparison-change neutral"
                                    }>

                                        {isPositive ? "+" : ""}
                                        {percentage.toFixed(2)}%

                                        <span>
                                            {" "}compared to previous period
                                        </span>

                                    </div>

                                </div>

                            );

                        })}

                    </div>


                    {/* SUMMARY */}

                    <div className="comparison-summary">

                        <h2>Performance Summary</h2>

                        <p>
                            {comparison.workout_change > 0
                                ? "Your workout count has increased compared to the previous period. Keep up the consistency!"
                                : comparison.workout_change < 0
                                    ? "Your workout count has decreased. Try to maintain a regular workout schedule."
                                    : "Your workout count is unchanged compared to the previous period."
                            }
                        </p>

                        <p>
                            Duration change:{" "}
                            <strong>
                                {comparison.duration_change}%
                            </strong>
                        </p>

                        <p>
                            Calories change:{" "}
                            <strong>
                                {comparison.calories_change}%
                            </strong>
                        </p>

                    </div>

                </>

            )}

        </div>

    );

}

export default ProgressComparison;