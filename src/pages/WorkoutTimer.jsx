import { useEffect, useState } from "react";

import {
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    stopWorkout,
    getActiveWorkout,
    getWorkoutHistory
} from "../services/workoutSessionService";

import "../style/WorkoutTimer.css";


function WorkoutTimer() {

    const [session, setSession] = useState(null);
    const [history, setHistory] = useState([]);
    const [workoutName, setWorkoutName] = useState("");
    const [category, setCategory] = useState("Cardio");
    const [elapsed, setElapsed] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // ==========================================
    // FORMAT TIMER
    // ==========================================

    const formatTime = (seconds) => {

        const safeSeconds = Math.max(0, Math.floor(seconds || 0));

        const hours = Math.floor(safeSeconds / 3600);

        const minutes = Math.floor(
            (safeSeconds % 3600) / 60
        );

        const remainingSeconds = safeSeconds % 60;

        return [
            String(hours).padStart(2, "0"),
            String(minutes).padStart(2, "0"),
            String(remainingSeconds).padStart(2, "0")
        ].join(":");

    };


    // ==========================================
    // PARSE BACKEND UTC TIMESTAMP
    // ==========================================

    const parseUTCTime = (value) => {

        if (!value) return Date.now();

        // SQLite may return a timestamp without timezone.
        // Treat such timestamps as UTC, not Indian local time.

        const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(value);

        const normalizedValue = hasTimezone
            ? value
            : `${value}Z`;

        return new Date(normalizedValue).getTime();

    };


    // ==========================================
    // CALCULATE ELAPSED TIME
    // ==========================================

    const calculateElapsed = (data) => {

        if (!data) return 0;

        if (data.status === "COMPLETED") {
            return data.duration_seconds || 0;
        }

        const start = parseUTCTime(data.start_time);

        const end = data.status === "PAUSED"
            ? parseUTCTime(data.paused_at)
            : Date.now();

        const totalSeconds = Math.floor(
            (end - start) / 1000
        );

        return Math.max(
            0,
            totalSeconds - (data.paused_duration_seconds || 0)
        );

    };


    // ==========================================
    // LOAD WORKOUT HISTORY
    // ==========================================

    const loadHistory = async () => {

        try {

            const data = await getWorkoutHistory();

            setHistory(data);

        } catch (err) {

            console.error(
                "History loading error:",
                err
            );

        }

    };


    // ==========================================
    // LOAD ACTIVE WORKOUT
    // ==========================================

    const loadActiveWorkout = async () => {

        try {

            const data = await getActiveWorkout();

            setSession(data);

            setElapsed(calculateElapsed(data));

        } catch (err) {

            if (err.response?.status === 404) {

                setSession(null);
                setElapsed(0);

            } else {

                setError(
                    err.response?.data?.detail ||
                    "Unable to load active workout."
                );

            }

        }

    };


    // ==========================================
    // INITIAL DATA
    // ==========================================

    useEffect(() => {

        const initialize = async () => {

            setLoading(true);

            await Promise.all([
                loadActiveWorkout(),
                loadHistory()
            ]);

            setLoading(false);

        };

        initialize();

    }, []);


    // ==========================================
    // LIVE TIMER
    // ==========================================

    useEffect(() => {

        if (!session || session.status !== "ACTIVE") {
            return;
        }

        const interval = setInterval(() => {

            setElapsed(calculateElapsed(session));

        }, 1000);

        return () => clearInterval(interval);

    }, [session]);


    // ==========================================
    // START WORKOUT
    // ==========================================

    const handleStart = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setMessage("");

            if (!workoutName.trim()) {

                setError("Please enter a workout name.");
                return;

            }

            const data = await startWorkout({

                workout_name: workoutName.trim(),

                category: category

            });

            setSession(data);

            setElapsed(0);

            setWorkoutName("");

            setMessage("Workout started successfully!");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to start workout."
            );

        }

    };


    // ==========================================
    // PAUSE WORKOUT
    // ==========================================

    const handlePause = async () => {

        try {

            setError("");

            const data = await pauseWorkout(session.id);

            setSession(data);

            setElapsed(calculateElapsed(data));

            setMessage("Workout paused.");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to pause workout."
            );

        }

    };


    // ==========================================
    // RESUME WORKOUT
    // ==========================================

    const handleResume = async () => {

        try {

            setError("");

            const data = await resumeWorkout(session.id);

            setSession(data);

            setElapsed(calculateElapsed(data));

            setMessage("Workout resumed!");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to resume workout."
            );

        }

    };


    // ==========================================
    // STOP WORKOUT
    // ==========================================

    const handleStop = async () => {

        if (!window.confirm(
            "Are you sure you want to finish this workout?"
        )) {
            return;
        }

        try {

            setError("");

            const data = await stopWorkout(session.id);

            setElapsed(data.duration_seconds);

            setSession(null);

            setMessage(
                `Workout completed! ${data.calories_burned} estimated calories burned.`
            );

            await loadHistory();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to stop workout."
            );

        }

    };


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {

        return (
            <div className="timer-loading">
                Loading workout timer...
            </div>
        );

    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="timer-page">

            <div className="timer-header">

                <div>
                    <h1>Workout Timer</h1>

                    <p>
                        Track your workouts in real time
                        and monitor your activity.
                    </p>
                </div>

            </div>


            {error && (

                <div className="timer-error">
                    {error}
                </div>

            )}


            {message && (

                <div className="timer-success">
                    {message}
                </div>

            )}


            {/* WORKOUT TIMER CARD */}

            <div className="timer-card">

                <div className="timer-status">

                    <span
                        className={
                            session
                                ? `status-badge ${session.status.toLowerCase()}`
                                : "status-badge inactive"
                        }
                    >
                        {session?.status || "NOT STARTED"}
                    </span>

                </div>


                <div className="timer-display">

                    {formatTime(elapsed)}

                </div>


                <p className="timer-caption">

                    {session
                        ? session.workout_name
                        : "Ready for your next workout?"}

                </p>


                {!session ? (

                    <form
                        className="timer-form"
                        onSubmit={handleStart}
                    >

                        <div className="timer-field">

                            <label>Workout Name</label>

                            <input
                                type="text"
                                placeholder="Enter workout name"
                                value={workoutName}
                                onChange={(e) =>
                                    setWorkoutName(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="timer-field">

                            <label>Workout Category</label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >

                                <option value="Cardio">Cardio</option>

                                <option value="Strength">Strength</option>

                                <option value="Yoga">Yoga</option>

                                <option value="Flexibility">Flexibility</option>

                                <option value="Other">Other</option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            className="timer-start-btn"
                        >
                            Start Workout
                        </button>

                    </form>

                ) : (

                    <div className="timer-controls">

                        {session.status === "ACTIVE" && (

                            <button
                                className="timer-pause-btn"
                                onClick={handlePause}
                            >
                                Pause
                            </button>

                        )}


                        {session.status === "PAUSED" && (

                            <button
                                className="timer-resume-btn"
                                onClick={handleResume}
                            >
                                Resume
                            </button>

                        )}


                        <button
                            className="timer-stop-btn"
                            onClick={handleStop}
                        >
                            Finish Workout
                        </button>

                    </div>

                )}

            </div>


            {/* WORKOUT INFORMATION */}

            {session && (

                <div className="timer-info-grid">

                    <div className="timer-info-card">

                        <span>Workout</span>

                        <strong>{session.workout_name}</strong>

                    </div>


                    <div className="timer-info-card">

                        <span>Category</span>

                        <strong>{session.category}</strong>

                    </div>


                    <div className="timer-info-card">

                        <span>Status</span>

                        <strong>{session.status}</strong>

                    </div>

                </div>

            )}


            {/* WORKOUT HISTORY */}

            <div className="timer-history">

                <h2>Workout Session History</h2>

                {history.length > 0 ? (

                    <div className="timer-history-table">

                        <table>

                            <thead>

                                <tr>
                                    <th>Workout</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    <th>Calories</th>
                                    <th>Status</th>
                                </tr>

                            </thead>


                            <tbody>

                                {history.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.workout_name}</td>

                                        <td>{item.category}</td>

                                        <td>
                                            {formatTime(item.duration_seconds)}
                                        </td>

                                        <td>
                                            {item.calories_burned} kcal
                                        </td>

                                        <td>
                                            <span className="history-status">
                                                {item.status}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="timer-empty">
                        No workout sessions recorded yet.
                    </div>

                )}

            </div>

        </div>

    );

}

export default WorkoutTimer;