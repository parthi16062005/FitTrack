import { useEffect, useState } from "react";

import {
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getGoalAnalytics,
    getAdvancedAnalytics
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
    const [advancedData, setAdvancedData] = useState(null);

    const [period, setPeriod] = useState("weekly");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD ALL ANALYTICS
    // ==========================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                weekly,
                monthly,
                goals,
                advanced
            ] = await Promise.all([
                getWeeklyAnalytics(),
                getMonthlyAnalytics(),
                getGoalAnalytics(),
                getAdvancedAnalytics()
            ]);

            setWeeklyData(weekly);
            setMonthlyData(monthly);
            setGoalData(goals);
            setAdvancedData(advanced);

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


    const summary = advancedData?.summary;


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
    // NUTRITION CHART DATA
    // ==========================================

    const nutritionChartData = advancedData ? [
        {
            name: "Protein",
            value: advancedData.nutrition.total_protein
        },
        {
            name: "Carbs",
            value: advancedData.nutrition.total_carbs
        },
        {
            name: "Fats",
            value: advancedData.nutrition.total_fats
        }
    ].filter(item => item.value > 0) : [];


    const nutritionColors = [
        "#2563eb",
        "#f59e0b",
        "#ec4899"
    ];


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
                    <h1>Advanced Analytics Dashboard</h1>

                    <p>
                        Track your fitness performance, nutrition,
                        hydration and achievements.
                    </p>
                </div>

                <button
                    className="analytics-refresh-button"
                    onClick={loadAnalytics}
                >
                    Refresh Data
                </button>

            </div>


            {/* ==================================
                ADVANCED SUMMARY
            ================================== */}

            <div className="analytics-section-title">
                <h2>Fitness Overview</h2>
                <p>Your overall fitness statistics</p>
            </div>


            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Total Workouts
                    </div>

                    <h2>{summary?.total_workouts || 0}</h2>

                    <span>Recorded workouts</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Calories Burned
                    </div>

                    <h2>
                        {(summary?.total_calories || 0).toLocaleString()}
                    </h2>

                    <span>kcal burned</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Workout Duration
                    </div>

                    <h2>{summary?.total_duration || 0}</h2>

                    <span>Minutes completed</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Completed Sessions
                    </div>

                    <h2>{summary?.total_sessions || 0}</h2>

                    <span>Timer sessions</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Average Calories
                    </div>

                    <h2>{summary?.average_calories || 0}</h2>

                    <span>Calories per workout</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Goal Achievement
                    </div>

                    <h2>
                        {advancedData?.goals?.achievement_percentage || 0}%
                    </h2>

                    <span>Goals completed</span>

                </div>

            </div>


            {/* ==================================
                WORKOUT ANALYTICS
            ================================== */}

            <div className="analytics-section-title">

                <h2>Workout Performance</h2>

                <p>
                    Analyze your weekly and monthly workout activity.
                </p>

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


            {/* WORKOUT SUMMARY */}

            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Period Workouts
                    </div>

                    <h2>{currentData?.total_workouts || 0}</h2>

                    <span>Workouts completed</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Period Calories
                    </div>

                    <h2>
                        {(currentData?.total_calories || 0).toLocaleString()}
                    </h2>

                    <span>kcal burned</span>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-card-label">
                        Period Duration
                    </div>

                    <h2>{currentData?.total_duration || 0}</h2>

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


            {/* WORKOUT CHARTS */}

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


                {/* GOAL CHART */}

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


                {/* CATEGORY CHART */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Workout Categories</h3>

                        <p>Workout distribution by category</p>

                    </div>

                    <div className="analytics-chart-container">

                        {advancedData?.category_breakdown?.length > 0 ? (

                            <ResponsiveContainer width="100%" height="100%">

                                <BarChart
                                    data={advancedData.category_breakdown}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="category" />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="total_workouts"
                                        name="Workouts"
                                        fill="#8b5cf6"
                                        radius={[6, 6, 0, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="analytics-empty-chart">
                                No workout categories available.
                            </div>

                        )}

                    </div>

                </div>


                {/* MONTHLY TREND CHART */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Monthly Workout Trends</h3>

                        <p>Workout activity over six months</p>

                    </div>

                    <div className="analytics-chart-container">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart
                                data={advancedData?.monthly_trends || []}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="total_workouts"
                                    name="Workouts"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    activeDot={{ r: 7 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* NUTRITION CHART */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-heading">

                        <h3>Nutrition Breakdown</h3>

                        <p>Protein, carbohydrates and fats</p>

                    </div>

                    <div className="analytics-chart-container">

                        {nutritionChartData.length > 0 ? (

                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={nutritionChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >

                                        {nutritionChartData.map((entry, index) => (

                                            <Cell
                                                key={entry.name}
                                                fill={nutritionColors[index]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="analytics-empty-chart">
                                No nutrition records available.
                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* ==================================
                NUTRITION STATISTICS
            ================================== */}

            <div className="analytics-section-title">

                <h2>Nutrition Statistics</h2>

                <p>Your recorded nutrition information</p>

            </div>


            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Total Meals</div>
                    <h2>{advancedData?.nutrition?.total_meals || 0}</h2>
                    <span>Meals recorded</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Food Calories</div>
                    <h2>{advancedData?.nutrition?.total_calories || 0}</h2>
                    <span>kcal consumed</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Protein</div>
                    <h2>{advancedData?.nutrition?.total_protein || 0} g</h2>
                    <span>Total protein</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Carbohydrates</div>
                    <h2>{advancedData?.nutrition?.total_carbs || 0} g</h2>
                    <span>Total carbohydrates</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Fats</div>
                    <h2>{advancedData?.nutrition?.total_fats || 0} g</h2>
                    <span>Total fats</span>
                </div>

            </div>


            {/* ==================================
                WATER STATISTICS
            ================================== */}

            <div className="analytics-section-title">

                <h2>Hydration Statistics</h2>

                <p>Your water intake performance</p>

            </div>


            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Total Water</div>
                    <h2>{advancedData?.water?.total_water || 0} ml</h2>
                    <span>Total recorded intake</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Average Daily Water</div>
                    <h2>{advancedData?.water?.average_daily_water || 0} ml</h2>
                    <span>Average on tracked days</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Water Entries</div>
                    <h2>{advancedData?.water?.total_entries || 0}</h2>
                    <span>Recorded entries</span>
                </div>

            </div>


            {/* ==================================
                WORKOUT STREAK
            ================================== */}

            <div className="analytics-section-title">

                <h2>Workout Consistency</h2>

                <p>Track your workout streak and consistency</p>

            </div>


            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Current Streak</div>
                    <h2>{advancedData?.streak?.current_streak || 0}</h2>
                    <span>Consecutive active days</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Longest Streak</div>
                    <h2>{advancedData?.streak?.longest_streak || 0}</h2>
                    <span>Best workout streak</span>
                </div>

                <div className="analytics-summary-card">
                    <div className="analytics-card-label">Active Days</div>
                    <h2>{advancedData?.streak?.total_active_days || 0}</h2>
                    <span>Total workout days</span>
                </div>

            </div>


            {/* ==================================
                DAILY BREAKDOWN TABLE
            ================================== */}

            <div className="analytics-table-card">

                <div className="analytics-chart-heading">

                    <h3>Daily Workout Breakdown</h3>

                    <p>Detailed workout statistics</p>

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