import { useEffect, useState } from "react";

import {
    createReminder,
    getReminders,
    completeReminder,
    deleteReminder
} from "../services/reminderService";

import "../style/Reminders.css";


// ==========================================
// TIMEZONE HELPERS
// ==========================================

// Convert a datetime-local value into an ISO datetime
// while preserving the selected local date and time.
const convertToLocalISOString = (value) => {

    if (!value) return "";

    const [datePart, timePart] = value.split("T");

    return `${datePart}T${timePart}:00+05:30`;

};


// Display reminder time in Indian Standard Time.
const formatDate = (value) => {

    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
    });

};


function Reminders() {

    const [reminders, setReminders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({

        title: "",

        description: "",

        reminder_type: "WORKOUT",

        reminder_time: ""

    });


    // ==========================================
    // LOAD REMINDERS
    // ==========================================

    const loadReminders = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getReminders();

            setReminders(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load reminders."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadReminders();

    }, []);


    // ==========================================
    // HANDLE FORM INPUT
    // ==========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // CREATE REMINDER
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (!formData.reminder_time) {

            setError(
                "Please select a reminder date and time."
            );

            return;

        }

        try {

            setSaving(true);

            const reminderTime = convertToLocalISOString(
                formData.reminder_time
            );

            await createReminder({

                ...formData,

                reminder_time: reminderTime

            });

            setSuccess(
                "Reminder created successfully!"
            );

            setFormData({

                title: "",

                description: "",

                reminder_type: "WORKOUT",

                reminder_time: ""

            });

            await loadReminders();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to create reminder."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // COMPLETE REMINDER
    // ==========================================

    const handleComplete = async (id) => {

        try {

            setError("");

            await completeReminder(id);

            setSuccess(
                "Reminder completed successfully!"
            );

            await loadReminders();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to complete reminder."
            );

        }

    };


    // ==========================================
    // DELETE REMINDER
    // ==========================================

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this reminder?")) {

            return;

        }

        try {

            setError("");

            await deleteReminder(id);

            setSuccess(
                "Reminder deleted successfully!"
            );

            await loadReminders();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to delete reminder."
            );

        }

    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const upcomingCount = reminders.filter(

        (item) =>
            item.is_active && !item.is_completed

    ).length;


    const completedCount = reminders.filter(

        (item) => item.is_completed

    ).length;


    const totalCount = reminders.length;


    // ==========================================
    // REMINDER PAGE UI
    // ==========================================

    return (

        <div className="reminders-page">


            {/* HEADER */}

            <div className="reminders-header">

                <div>

                    <span className="reminders-label">
                        FITTRACK MANAGEMENT
                    </span>

                    <h1>
                        Reminders & Alerts
                    </h1>

                    <p>
                        Stay consistent with your fitness routine.
                        Manage your upcoming activities and alerts.
                    </p>

                </div>

                <div className="reminder-header-icon">
                    🔔
                </div>

            </div>


            {/* STATISTICS */}

            <div className="reminder-stats">


                <div className="reminder-stat-card">

                    <div className="stat-icon purple">
                        📋
                    </div>

                    <div>

                        <span>Total Reminders</span>

                        <h2>{totalCount}</h2>

                    </div>

                </div>


                <div className="reminder-stat-card">

                    <div className="stat-icon blue">
                        ⏰
                    </div>

                    <div>

                        <span>Upcoming</span>

                        <h2>{upcomingCount}</h2>

                    </div>

                </div>


                <div className="reminder-stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>

                        <span>Completed</span>

                        <h2>{completedCount}</h2>

                    </div>

                </div>

            </div>


            {/* ALERT MESSAGES */}

            {error && (

                <div className="reminder-alert error">

                    {error}

                </div>

            )}


            {success && (

                <div className="reminder-alert success">

                    {success}

                </div>

            )}


            {/* MAIN CONTENT */}

            <div className="reminder-content-grid">


                {/* CREATE REMINDER FORM */}

                <div className="reminder-form-card">


                    <div className="reminder-section-heading">

                        <div>

                            <h2>Create Reminder</h2>

                            <p>
                                Schedule your next activity.
                            </p>

                        </div>

                        <span className="heading-icon">
                            ＋
                        </span>

                    </div>


                    <form onSubmit={handleSubmit}>


                        {/* TITLE */}

                        <div className="reminder-input-group">

                            <label>
                                Reminder Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Example: Morning Workout"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={150}
                                required
                            />

                        </div>


                        {/* TYPE */}

                        <div className="reminder-input-group">

                            <label>
                                Reminder Type
                            </label>

                            <select
                                name="reminder_type"
                                value={formData.reminder_type}
                                onChange={handleChange}
                            >

                                <option value="WORKOUT">
                                    Workout
                                </option>

                                <option value="WATER">
                                    Water Intake
                                </option>

                                <option value="MEAL">
                                    Meal
                                </option>

                                <option value="GOAL">
                                    Fitness Goal
                                </option>

                                <option value="GENERAL">
                                    General
                                </option>

                            </select>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="reminder-input-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Enter reminder details..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />

                        </div>


                        {/* DATE AND TIME */}

                        <div className="reminder-input-group">

                            <label>
                                Date & Time (IST)
                            </label>

                            <input
                                type="datetime-local"
                                name="reminder_time"
                                value={formData.reminder_time}
                                onChange={handleChange}
                                required
                            />

                            <small>
                                Time is based on Indian Standard Time (IST).
                            </small>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="create-reminder-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Creating..."
                                : "+ Create Reminder"
                            }

                        </button>

                    </form>

                </div>


                {/* REMINDER LIST */}

                <div className="reminder-list-card">


                    <div className="reminder-section-heading">

                        <div>

                            <h2>My Reminders</h2>

                            <p>
                                View and manage your activities.
                            </p>

                        </div>


                        <button
                            className="refresh-reminders-btn"
                            onClick={loadReminders}
                            type="button"
                        >

                            ↻ Refresh

                        </button>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="reminder-empty">

                            Loading reminders...

                        </div>

                    ) : reminders.length === 0 ? (

                        /* EMPTY STATE */

                        <div className="reminder-empty">

                            <div className="empty-icon">
                                🔔
                            </div>

                            <h3>
                                No reminders yet
                            </h3>

                            <p>
                                Create your first reminder to stay
                                consistent with your fitness goals.
                            </p>

                        </div>

                    ) : (


                        /* REMINDER ITEMS */

                        <div className="reminder-list">

                            {reminders.map((reminder) => (

                                <div
                                    className="reminder-item"
                                    key={reminder.id}
                                >


                                    {/* REMINDER HEADER */}

                                    <div className="reminder-item-top">


                                        <div className="reminder-item-icon">

                                            {reminder.reminder_type === "WORKOUT"
                                                ? "🏋️"
                                                : reminder.reminder_type === "WATER"
                                                ? "💧"
                                                : reminder.reminder_type === "MEAL"
                                                ? "🍎"
                                                : reminder.reminder_type === "GOAL"
                                                ? "🎯"
                                                : "🔔"
                                            }

                                        </div>


                                        <div className="reminder-item-info">

                                            <h3>
                                                {reminder.title}
                                            </h3>

                                            <span className="reminder-type">
                                                {reminder.reminder_type}
                                            </span>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`reminder-status ${
                                                reminder.is_completed
                                                    ? "completed"
                                                    : reminder.is_active
                                                    ? "upcoming"
                                                    : "inactive"
                                            }`}
                                        >

                                            {reminder.is_completed
                                                ? "Completed"
                                                : reminder.is_active
                                                ? "Upcoming"
                                                : "Inactive"
                                            }

                                        </span>

                                    </div>


                                    {/* DESCRIPTION */}

                                    {reminder.description && (

                                        <p className="reminder-description">

                                            {reminder.description}

                                        </p>

                                    )}


                                    {/* DATE AND ACTIONS */}

                                    <div className="reminder-item-footer">


                                        <span className="reminder-date">

                                            📅 {formatDate(reminder.reminder_time)}

                                        </span>


                                        <div className="reminder-actions">


                                            {!reminder.is_completed &&
                                                reminder.is_active && (

                                                <button
                                                    className="complete-reminder-btn"
                                                    onClick={() =>
                                                        handleComplete(reminder.id)
                                                    }
                                                >

                                                    ✓ Complete

                                                </button>

                                            )}


                                            <button
                                                className="delete-reminder-btn"
                                                onClick={() =>
                                                    handleDelete(reminder.id)
                                                }
                                            >

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Reminders;