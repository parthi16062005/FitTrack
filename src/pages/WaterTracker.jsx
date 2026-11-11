import { useEffect, useState } from "react";

import {
    logWater,
    getWaterHistory,
    getWaterSummary,
    deleteWaterEntry
} from "../services/waterService";

import "../style/WaterTracker.css";


function WaterTracker() {

    const [history, setHistory] = useState([]);

    const [summary, setSummary] = useState({
        total_water: 0,
        daily_goal: 2500,
        remaining_water: 2500,
        completion_percentage: 0,
        total_entries: 0
    });

    const [quantity, setQuantity] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD WATER DATA
    // ==========================================

    const loadWaterData = async () => {

        try {

            setLoading(true);
            setError("");

            const [historyData, summaryData] = await Promise.all([
                getWaterHistory(),
                getWaterSummary()
            ]);

            setHistory(historyData);
            setSummary(summaryData);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load water tracking data."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadWaterData();
    }, []);


    // ==========================================
    // LOG WATER
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setSuccess("");

            await logWater(quantity);

            setQuantity("");

            setSuccess("Water intake recorded successfully!");

            await loadWaterData();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to record water intake."
            );

        }

    };


    // ==========================================
    // QUICK ADD WATER
    // ==========================================

    const handleQuickAdd = async (amount) => {

        try {

            setError("");
            setSuccess("");

            await logWater(amount);

            setSuccess(`${amount} ml water added successfully!`);

            await loadWaterData();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to add water."
            );

        }

    };


    // ==========================================
    // DELETE WATER ENTRY
    // ==========================================

    const handleDelete = async (entryId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this entry?"
        );

        if (!confirmDelete) return;

        try {

            setError("");
            setSuccess("");

            await deleteWaterEntry(entryId);

            setSuccess("Water entry deleted successfully!");

            await loadWaterData();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to delete water entry."
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="water-loading">
                Loading water tracking...
            </div>
        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="water-page">

            <div className="water-header">

                <div>
                    <h1>Water Intake Tracker</h1>

                    <p>
                        Stay hydrated and monitor your daily water intake.
                    </p>
                </div>

            </div>


            {/* MESSAGES */}

            {error && (
                <div className="water-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="water-success">
                    {success}
                </div>
            )}


            {/* WATER SUMMARY */}

            <div className="water-summary-grid">

                <div className="water-card consumed-card">

                    <div className="water-card-icon">W</div>

                    <h3>Water Consumed</h3>

                    <h2>
                        {(summary.total_water / 1000).toFixed(2)} L
                    </h2>

                    <p>
                        {summary.total_water} ml consumed today
                    </p>

                </div>


                <div className="water-card goal-card">

                    <div className="water-card-icon">G</div>

                    <h3>Daily Goal</h3>

                    <h2>
                        {(summary.daily_goal / 1000).toFixed(2)} L
                    </h2>

                    <p>
                        {summary.daily_goal} ml target
                    </p>

                </div>


                <div className="water-card remaining-card">

                    <div className="water-card-icon">R</div>

                    <h3>Remaining Water</h3>

                    <h2>
                        {(summary.remaining_water / 1000).toFixed(2)} L
                    </h2>

                    <p>
                        {summary.remaining_water} ml remaining
                    </p>

                </div>

            </div>


            {/* PROGRESS SECTION */}

            <div className="water-progress-section">

                <div className="water-progress-header">

                    <div>
                        <h2>Daily Hydration Progress</h2>

                        <p>
                            Track your daily hydration goal.
                        </p>
                    </div>

                    <h2 className="water-percentage">
                        {summary.completion_percentage}%
                    </h2>

                </div>


                <div className="water-progress-track">

                    <div
                        className="water-progress-fill"
                        style={{
                            width: `${Math.min(summary.completion_percentage, 100)}%`
                        }}
                    />

                </div>


                <div className="water-progress-footer">

                    <span>
                        {summary.total_water} ml
                    </span>

                    <span>
                        {summary.daily_goal} ml
                    </span>

                </div>

                {summary.completion_percentage >= 100 && (

                    <div className="water-goal-completed">
                        Daily water goal completed!
                    </div>

                )}

            </div>


            {/* QUICK ADD */}

            <div className="water-quick-section">

                <h2>Quick Add Water</h2>

                <p>Select a quantity to record your intake.</p>

                <div className="water-quick-buttons">

                    <button onClick={() => handleQuickAdd(150)}>
                        +150 ml
                    </button>

                    <button onClick={() => handleQuickAdd(250)}>
                        +250 ml
                    </button>

                    <button onClick={() => handleQuickAdd(500)}>
                        +500 ml
                    </button>

                    <button onClick={() => handleQuickAdd(750)}>
                        +750 ml
                    </button>

                </div>

            </div>


            {/* CUSTOM WATER ENTRY */}

            <div className="water-form-section">

                <h2>Add Custom Water Intake</h2>

                <form
                    className="water-form"
                    onSubmit={handleSubmit}
                >

                    <div className="water-form-field">

                        <label>Water Quantity (ml)</label>

                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter water quantity"
                            min="1"
                            max="5000"
                            required
                        />

                    </div>


                    <button type="submit">
                        Add Water
                    </button>

                </form>

            </div>


            {/* WATER HISTORY */}

            <div className="water-history-section">

                <h2>Water Intake History</h2>

                {history.length === 0 ? (

                    <div className="water-empty">
                        No water intake records found.
                    </div>

                ) : (

                    <div className="water-table-wrapper">

                        <table className="water-table">

                            <thead>

                                <tr>
                                    <th>Entry ID</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {history.map((entry) => (

                                    <tr key={entry.id}>

                                        <td>#{entry.id}</td>

                                        <td>
                                            {entry.quantity} ml
                                            ({(entry.quantity / 1000).toFixed(2)} L)
                                        </td>

                                        <td>{entry.date}</td>

                                        <td>

                                            <button
                                                className="water-delete-button"
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                Delete
                                            </button>

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

export default WaterTracker;