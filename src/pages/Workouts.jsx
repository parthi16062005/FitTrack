import { useEffect, useState } from "react";

import {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
} from "../services/workoutService";

import "../style/Workouts.css";


function getToday() {
    const today = new Date();
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}


const initialForm = {
    workout_name: "",
    category: "Cardio",
    duration: "",
    calories_burned: "",
    workout_date: getToday(),
    notes: ""
};


function Workouts() {

    const [workouts, setWorkouts] = useState([]);
    const [formData, setFormData] = useState(initialForm);

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD WORKOUTS
    // ==========================================

    const loadWorkouts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getWorkouts();

            setWorkouts(data);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load workouts."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadWorkouts();
    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            ...initialForm,
            workout_date: getToday()
        });

        setEditingId(null);
        setError("");
    };


    // ==========================================
    // CREATE / UPDATE WORKOUT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const workoutData = {
            workout_name: formData.workout_name.trim(),
            category: formData.category,
            duration: Number(formData.duration),
            calories_burned: Number(formData.calories_burned),
            workout_date: formData.workout_date,
            notes: formData.notes.trim() || null
        };

        if (
            !workoutData.workout_name ||
            !workoutData.duration ||
            !workoutData.workout_date
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSaving(true);

            if (editingId) {

                await updateWorkout(editingId, workoutData);

                setSuccess("Workout updated successfully!");

            } else {

                await createWorkout(workoutData);

                setSuccess("Workout created successfully!");
            }

            resetForm();
            await loadWorkouts();

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Something went wrong. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };


    // ==========================================
    // EDIT WORKOUT
    // ==========================================

    const handleEdit = (workout) => {

        setEditingId(workout.id);

        setFormData({
            workout_name: workout.workout_name,
            category: workout.category,
            duration: workout.duration,
            calories_burned: workout.calories_burned,
            workout_date: workout.workout_date,
            notes: workout.notes || ""
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // DELETE WORKOUT
    // ==========================================

    const handleDelete = async (workoutId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this workout?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await deleteWorkout(workoutId);

            setSuccess("Workout deleted successfully!");

            await loadWorkouts();

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to delete workout."
            );
        }
    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalWorkouts = workouts.length;

    const totalDuration = workouts.reduce(
        (total, workout) => total + Number(workout.duration || 0),
        0
    );

    const totalCalories = workouts.reduce(
        (total, workout) => total + Number(workout.calories_burned || 0),
        0
    );


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date + "T00:00:00").toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ==========================================
    // PAGE UI
    // ==========================================

    return (

        <div className="workouts-page">

            {/* PAGE HEADER */}

            <div className="workouts-header">

                <div>
                    <h1>Workout Management</h1>

                    <p>
                        Track your workouts and monitor your fitness activities.
                    </p>
                </div>

            </div>


            {/* STATISTICS */}

            <div className="workout-stats">

                <div className="workout-stat-card">
                    <div className="stat-icon">W</div>

                    <div>
                        <h3>{totalWorkouts}</h3>
                        <p>Total Workouts</p>
                    </div>
                </div>


                <div className="workout-stat-card">
                    <div className="stat-icon">T</div>

                    <div>
                        <h3>{totalDuration}</h3>
                        <p>Total Minutes</p>
                    </div>
                </div>


                <div className="workout-stat-card">
                    <div className="stat-icon">C</div>

                    <div>
                        <h3>{totalCalories.toLocaleString()}</h3>
                        <p>Calories Burned</p>
                    </div>
                </div>

            </div>


            {/* ALERT MESSAGES */}

            {error && (
                <div className="workout-alert error-alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="workout-alert success-alert">
                    {success}
                </div>
            )}


            {/* WORKOUT FORM */}

            <div className="workout-form-card">

                <div className="workout-section-heading">

                    <div>
                        <h2>
                            {editingId ? "Edit Workout" : "Add New Workout"}
                        </h2>

                        <p>
                            Enter your workout details below.
                        </p>
                    </div>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="workout-form-grid">

                        <div className="workout-form-group">

                            <label>Workout Name *</label>

                            <input
                                type="text"
                                name="workout_name"
                                placeholder="Example: Morning Running"
                                value={formData.workout_name}
                                onChange={handleChange}
                                minLength={2}
                                required
                            />

                        </div>


                        <div className="workout-form-group">

                            <label>Category *</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                                <option value="Yoga">Yoga</option>
                            </select>

                        </div>


                        <div className="workout-form-group">

                            <label>Duration (Minutes) *</label>

                            <input
                                type="number"
                                name="duration"
                                placeholder="30"
                                min="1"
                                max="1440"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="workout-form-group">

                            <label>Calories Burned *</label>

                            <input
                                type="number"
                                name="calories_burned"
                                placeholder="250"
                                min="0"
                                max="10000"
                                value={formData.calories_burned}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="workout-form-group">

                            <label>Workout Date *</label>

                            <input
                                type="date"
                                name="workout_date"
                                value={formData.workout_date}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="workout-form-group full-width">

                            <label>Notes</label>

                            <textarea
                                name="notes"
                                placeholder="Add workout notes..."
                                rows="3"
                                value={formData.notes}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <div className="workout-form-actions">

                        <button
                            type="submit"
                            className="workout-submit-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Workout"
                                    : "Add Workout"
                            }
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="workout-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* WORKOUT LIST */}

            <div className="workout-list-card">

                <div className="workout-section-heading">

                    <div>
                        <h2>Workout History</h2>

                        <p>
                            View and manage your recorded workouts.
                        </p>
                    </div>

                    <span className="workout-count">
                        {totalWorkouts} Workouts
                    </span>

                </div>


                {loading ? (

                    <div className="workout-empty">
                        Loading workouts...
                    </div>

                ) : workouts.length === 0 ? (

                    <div className="workout-empty">
                        <h3>No workouts found</h3>

                        <p>
                            Add your first workout to start tracking your fitness.
                        </p>
                    </div>

                ) : (

                    <div className="workout-table-wrapper">

                        <table className="workout-table">

                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    <th>Calories</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>

                                {workouts.map((workout) => (

                                    <tr key={workout.id}>

                                        <td>
                                            <div className="workout-name-cell">
                                                <strong>
                                                    {workout.workout_name}
                                                </strong>

                                                {workout.notes && (
                                                    <small>
                                                        {workout.notes}
                                                    </small>
                                                )}
                                            </div>
                                        </td>


                                        <td>
                                            <span
                                                className={`workout-category ${workout.category.toLowerCase()}`}
                                            >
                                                {workout.category}
                                            </span>
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


                                        <td>

                                            <div className="workout-action-buttons">

                                                <button
                                                    className="workout-edit-btn"
                                                    onClick={() => handleEdit(workout)}
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="workout-delete-btn"
                                                    onClick={() => handleDelete(workout.id)}
                                                >
                                                    Delete
                                                </button>

                                            </div>

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

export default Workouts;