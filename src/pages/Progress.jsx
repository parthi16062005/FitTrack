import { useEffect, useState } from "react";

import { getDailyProgress } from "../services/progressService";

import "../style/Progress.css";


function Progress() {

    const [progress, setProgress] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD DAILY PROGRESS
    // ==========================================

    const loadProgress = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getDailyProgress(selectedDate);

            setProgress(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load daily progress."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadProgress();

    }, [selectedDate]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="progress-page">

            <div className="progress-header">

                <div>
                    <h1>Daily Progress</h1>

                    <p>
                        Track your daily fitness activities and achievements.
                    </p>
                </div>

                <div className="progress-date">

                    <label htmlFor="progress-date">
                        Select Date
                    </label>

                    <input
                        id="progress-date"
                        type="date"
                        value={selectedDate}
                        max={new Date().toLocaleDateString("en-CA")}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                </div>

            </div>


            {error && (

                <div className="progress-error">
                    {error}
                </div>

            )}


            {loading ? (

                <div className="progress-loading">
                    Loading progress...
                </div>

            ) : progress && (

                <>

                    <div className="progress-summary">

                        <div className="progress-card">

                            <div className="progress-icon">
                                W
                            </div>

                            <h3>Total Workouts</h3>

                            <h2>
                                {progress.total_workouts}
                            </h2>

                            <p>Workouts completed</p>

                        </div>


                        <div className="progress-card">

                            <div className="progress-icon">
                                T
                            </div>

                            <h3>Workout Duration</h3>

                            <h2>
                                {progress.total_duration}
                                <span> min</span>
                            </h2>

                            <p>Total active time</p>

                        </div>


                        <div className="progress-card">

                            <div className="progress-icon">
                                C
                            </div>

                            <h3>Calories Burned</h3>

                            <h2>
                                {progress.total_calories}
                            </h2>

                            <p>Calories burned</p>

                        </div>

                    </div>


                    <div className="progress-details">

                        <h2>Daily Summary</h2>

                        <p>
                            Your fitness summary for{" "}
                            <strong>
                                {formatDate(progress.progress_date)}
                            </strong>
                        </p>

                        <div className="progress-detail-row">

                            <span>Workout Sessions</span>

                            <strong>
                                {progress.total_workouts}
                            </strong>

                        </div>


                        <div className="progress-detail-row">

                            <span>Total Duration</span>

                            <strong>
                                {progress.total_duration} minutes
                            </strong>

                        </div>


                        <div className="progress-detail-row">

                            <span>Total Calories</span>

                            <strong>
                                {progress.total_calories} kcal
                            </strong>

                        </div>

                    </div>

                </>

            )}

        </div>

    );

}

export default Progress;