import { useEffect, useState } from "react";

import {
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getGoalAnalytics
} from "../services/analyticsService";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts";

import "../style/Analytics.css";


function Analytics() {

    const [weeklyData, setWeeklyData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [goalData, setGoalData] = useState(null);

    const [period, setPeriod] = useState("weekly");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD ANALYTICS
    // ==========================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                weekly,
                monthly,
                goals
            ] = await Promise.all([
                getWeeklyAnalytics(),
                getMonthlyAnalytics(),
                getGoalAnalytics()
            ]);

            setWeeklyData(weekly);
            setMonthlyData(monthly);
            setGoalData(goals);

        } catch (err) {

            console.error("Analytics loading error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load analytics data."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadAnalytics();
    }, []);


    // ==========================================
    // CURRENT ANALYTICS DATA
    // ==========================================

    const currentData = period === "weekly"
        ? weeklyData
        : monthlyData;


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (value) => {

        if (!value) return "";

        return new Date(value + "T00:00:00")
            .toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            });
    };


    // ==========================================
    // GOAL CHART DATA
    // ==========================================

    const goalChartData = goalData ? [
        {
            name: "Completed",
            value: goalData.completed_goals
        },
        {
            name: "Active",
            value: goalData.active_goals
        }
    ] : [];


    const goalColors = ["#16a34a", "#f59e0b"];


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="analytics-loading">
                Loading analytics...
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="analytics-error">

                <p>{error}</p>

                <button onClick={loadAnalytics}>
                    Try Again
                </button>

            </div>
        );

    }


    // ==========================================
    // MAIN ANALYTICS PAGE
    // ==========================================

    return (

        <div className="analytics-page">

            {/* PAGE HEADER */}

            <div className="analytics-header">

                <div>
                    <h1>Reports & Analytics</h1>

                    <p>
                        Track your workout performance and fitness achievements.
                    </p>
                </div>

                <button
                    className="analytics-refresh-button"
                    onClick={loadAnalytics}
                >
                    Refresh Data
                </button>

            </div>


            {/* PERIOD SELECTOR */}

            <div className="analytics-period-selector">

                <button
                    className={period === "weekly" ? "active" : ""}
                    onClick={() => setPeriod("weekly")}
                >
                    Weekly
                </button>

                <button
                    className={period === "monthly" ? "active" : ""}
                    onClick={() => setPeriod("monthly")}
                >
                    Monthly
                </button>

            </div>


            {/* SUMMARY CARDS */}

            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Total Workouts
                    </div>

                    <h2>
                        {currentData?.total_workouts || 0}
                    </h2>

                    <span>Workouts completed</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Calories Burned
                    </div>

                    <h2>
                        {(currentData?.total_calories || 0).toLocaleString()}
                    </h2>

                    <span>kcal burned</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Workout Duration
                    </div>

                    <h2>
                        {currentData?.total_duration || 0}
                    </h2>

                    <span>Minutes spent</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Goal Achievement
                    </div>

                    <h2>
                        {goalData?.achievement_percentage || 0}%
                    </h2>

                    <span>Goals completed</span>

                </div>

            </div>


            {/* CHARTS */}

            <div className="analytics-charts-grid">


                {/* CALORIES CHART */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Calories Burned</h3>

                        <p>Daily calorie performance</p>

                    </div>

                    <div className="analytics-chart-container">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={currentData?.daily_breakdown || []}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                />

                                <YAxis />

                                <Tooltip
                                    labelFormatter={formatDate}
                                />

                                <Legend />

                                <Bar
                                    dataKey="calories"
                                    name="Calories"
                                    fill="#16a34a"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* DURATION CHART */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Workout Duration</h3>

                        <p>Daily workout time in minutes</p>

                    </div>

                    <div className="analytics-chart-container">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={currentData?.daily_breakdown || []}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                />

                                <YAxis />

                                <Tooltip
                                    labelFormatter={formatDate}
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="duration"
                                    name="Duration"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    activeDot={{ r: 7 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* GOAL ACHIEVEMENT CHART */}

                <div className="analytics-chart-card analytics-goal-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Goal Achievement</h3>

                        <p>Your fitness goal completion status</p>

                    </div>

                    <div className="analytics-chart-container">

                        {goalData?.total_goals > 0 ? (

                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={goalChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >

                                        {goalChartData.map((entry, index) => (

                                            <Cell
                                                key={entry.name}
                                                fill={goalColors[index]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="analytics-empty-chart">
                                No goals available yet.
                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* DAILY BREAKDOWN TABLE */}

            <div className="analytics-table-card">

                <div className="analytics-chart-heading">

                    <h3>Daily Workout Breakdown</h3>

                    <p>
                        Detailed workout statistics
                    </p>

                </div>

                <div className="analytics-table-wrapper">

                    <table className="analytics-table">

                        <thead>

                            <tr>
                                <th>Date</th>
                                <th>Workouts</th>
                                <th>Calories</th>
                                <th>Duration</th>
                            </tr>

                        </thead>

                        <tbody>

                            {currentData?.daily_breakdown?.length > 0 ? (

                                currentData.daily_breakdown.map((item) => (

                                    <tr key={item.date}>

                                        <td>{formatDate(item.date)}</td>

                                        <td>{item.workouts}</td>

                                        <td>{item.calories} kcal</td>

                                        <td>{item.duration} min</td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="4" className="analytics-no-data">
                                        No workout records available for this period.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Analytics;