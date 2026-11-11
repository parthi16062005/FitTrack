import { useEffect, useState } from "react";

import {
    createWorkoutPlan,
    getWorkoutPlans,
    updateWorkoutPlan,
    deleteWorkoutPlan
} from "../services/workoutPlanService";

import "../style/WorkoutPlans.css";
import "../style/WorkoutCalendar.css";


// ==========================================
// DATE HELPERS
// ==========================================

const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const initialForm = {
    title: "",
    description: "",
    scheduled_date: getTodayDate()
};


// ==========================================
// WORKOUT PLANS PAGE
// ==========================================

function WorkoutPlans() {

    const [plans, setPlans] = useState([]);

    const [formData, setFormData] = useState(initialForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // Calendar states
    const [currentMonth, setCurrentMonth] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const [selectedDate, setSelectedDate] = useState(getTodayDate());


    // ==========================================
    // FETCH WORKOUT PLANS
    // ==========================================

    const fetchPlans = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getWorkoutPlans();

            setPlans(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load workout plans."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchPlans();
    }, []);


    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // CREATE / UPDATE WORKOUT PLAN
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        try {

            setSaving(true);

            if (editingId) {

                await updateWorkoutPlan(editingId, formData);

                setSuccess("Workout plan updated successfully!");

            } else {

                await createWorkoutPlan(formData);

                setSuccess("Workout plan created successfully!");

            }

            setSelectedDate(formData.scheduled_date);

            const scheduledDate = new Date(
                `${formData.scheduled_date}T00:00:00`
            );

            setCurrentMonth(
                new Date(
                    scheduledDate.getFullYear(),
                    scheduledDate.getMonth(),
                    1
                )
            );

            setFormData(initialForm);
            setEditingId(null);

            await fetchPlans();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to save workout plan."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // EDIT WORKOUT PLAN
    // ==========================================

    const handleEdit = (plan) => {

        setEditingId(plan.id);

        setFormData({
            title: plan.title,
            description: plan.description || "",
            scheduled_date: plan.scheduled_date
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // CANCEL EDITING
    // ==========================================

    const handleCancel = () => {

        setEditingId(null);

        setFormData(initialForm);

        setError("");
        setSuccess("");

    };


    // ==========================================
    // DELETE WORKOUT PLAN
    // ==========================================

    const handleDelete = async (planId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this workout plan?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteWorkoutPlan(planId);

            setSuccess("Workout plan deleted successfully!");

            if (editingId === planId) {
                handleCancel();
            }

            await fetchPlans();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to delete workout plan."
            );

        }

    };


    // ==========================================
    // DATE FORMATTING
    // ==========================================

    const formatDate = (dateValue) => {

        return new Date(
            `${dateValue}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    };


    // ==========================================
    // SORT WORKOUT PLANS
    // ==========================================

    const sortedPlans = [...plans].sort((a, b) => {

        return a.scheduled_date.localeCompare(
            b.scheduled_date
        );

    });


    const today = getTodayDate();

    const upcomingPlans = sortedPlans.filter(
        (plan) => plan.scheduled_date >= today
    );


    // ==========================================
    // CALENDAR MONTH NAVIGATION
    // ==========================================

    const changeMonth = (direction) => {

        setCurrentMonth((previous) => {

            return new Date(
                previous.getFullYear(),
                previous.getMonth() + direction,
                1
            );

        });

    };


    const monthTitle = currentMonth.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );


    // ==========================================
    // GENERATE CALENDAR DAYS
    // ==========================================

    const firstDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    // Monday-first calendar
    const startingDay = (firstDay.getDay() + 6) % 7;

    const calendarCells = [
        ...Array(startingDay).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
        )
    ];


    // ==========================================
    // GET PLANS FOR A DATE
    // ==========================================

    const getPlansForDate = (dateKey) => {

        return plans.filter(
            (plan) => plan.scheduled_date === dateKey
        );

    };


    const selectedDatePlans = sortedPlans.filter(
        (plan) => plan.scheduled_date === selectedDate
    );


    // ==========================================
    // PAGE UI
    // ==========================================

    return (

        <div className="workout-plans-page">

            {/* PAGE HEADER */}

            <div className="workout-plans-header">

                <div>

                    <h1>Workout Planner</h1>

                    <p>
                        Plan your fitness journey and stay consistent.
                    </p>

                </div>

                <div className="planner-header-icon">
                    WP
                </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className="planner-summary">

                <div className="planner-summary-card">
                    <span>Total Plans</span>
                    <h2>{plans.length}</h2>
                </div>

                <div className="planner-summary-card">
                    <span>Upcoming Workouts</span>
                    <h2>{upcomingPlans.length}</h2>
                </div>

                <div className="planner-summary-card">
                    <span>Today's Workouts</span>

                    <h2>
                        {
                            plans.filter(
                                (plan) => plan.scheduled_date === today
                            ).length
                        }
                    </h2>

                </div>

            </div>


            {/* ALERT MESSAGES */}

            {error && (
                <div className="planner-alert planner-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="planner-alert planner-success">
                    {success}
                </div>
            )}


            {/* WORKOUT PLAN FORM */}

            <div className="planner-form-card">

                <div className="planner-section-header">

                    <h2>
                        {editingId
                            ? "Update Workout Plan"
                            : "Create Workout Plan"}
                    </h2>

                    <p>
                        Schedule your next workout in advance.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="planner-form-grid">

                        {/* TITLE */}

                        <div className="planner-form-group">

                            <label htmlFor="plan-title">
                                Workout Plan Title
                            </label>

                            <input
                                id="plan-title"
                                type="text"
                                name="title"
                                placeholder="Example: Morning Cardio"
                                value={formData.title}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={150}
                                required
                            />

                        </div>


                        {/* SCHEDULE DATE */}

                        <div className="planner-form-group">

                            <label htmlFor="scheduled-date">
                                Scheduled Date
                            </label>

                            <input
                                id="scheduled-date"
                                type="date"
                                name="scheduled_date"
                                min={today}
                                value={formData.scheduled_date}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="planner-form-group planner-full-width">

                            <label htmlFor="plan-description">
                                Description
                            </label>

                            <textarea
                                id="plan-description"
                                name="description"
                                placeholder="Describe your planned workout..."
                                value={formData.description}
                                onChange={handleChange}
                                maxLength={1000}
                                rows={4}
                            />

                        </div>

                    </div>


                    {/* FORM BUTTONS */}

                    <div className="planner-form-actions">

                        <button
                            type="submit"
                            className="planner-primary-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Plan"
                                    : "Schedule Workout"}

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="planner-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ==================================
                MONTHLY CALENDAR
            ================================== */}

            <div className="planner-calendar-card">

                <div className="planner-calendar-header">

                    <div>

                        <h2>Workout Calendar</h2>

                        <p>
                            Select a date to view scheduled workouts.
                        </p>

                    </div>


                    <div className="planner-calendar-navigation">

                        <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                            aria-label="Previous month"
                        >
                            &#8249;
                        </button>

                        <h3>{monthTitle}</h3>

                        <button
                            type="button"
                            onClick={() => changeMonth(1)}
                            aria-label="Next month"
                        >
                            &#8250;
                        </button>

                    </div>

                </div>


                {/* WEEKDAY HEADINGS */}

                <div className="planner-calendar-grid">

                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (

                            <div
                                className="planner-calendar-weekday"
                                key={day}
                            >
                                {day}
                            </div>

                        )
                    )}


                    {/* CALENDAR DATES */}

                    {calendarCells.map((day, index) => {

                        if (day === null) {

                            return (
                                <div
                                    className="planner-calendar-empty"
                                    key={`empty-${index}`}
                                />
                            );

                        }

                        const dateObject = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day
                        );

                        const dateKey = formatDateKey(dateObject);

                        const dayPlans = getPlansForDate(dateKey);

                        const isToday = dateKey === today;

                        const isSelected = dateKey === selectedDate;

                        return (

                            <button
                                type="button"
                                key={dateKey}
                                className={[
                                    "planner-calendar-day",
                                    isToday ? "today" : "",
                                    isSelected ? "selected" : "",
                                    dayPlans.length > 0 ? "has-plans" : ""
                                ].filter(Boolean).join(" ")}
                                onClick={() => setSelectedDate(dateKey)}
                            >

                                <span className="planner-calendar-day-number">
                                    {day}
                                </span>

                                {dayPlans.length > 0 && (

                                    <span className="planner-calendar-count">
                                        {dayPlans.length} {dayPlans.length === 1 ? "plan" : "plans"}
                                    </span>

                                )}

                            </button>

                        );

                    })}

                </div>


                {/* CALENDAR LEGEND */}

                <div className="planner-calendar-legend">

                    <span>
                        <i className="legend-today"></i>
                        Today
                    </span>

                    <span>
                        <i className="legend-planned"></i>
                        Scheduled workout
                    </span>

                    <span>
                        <i className="legend-selected"></i>
                        Selected date
                    </span>

                </div>


                {/* SELECTED DATE DETAILS */}

                <div className="planner-selected-date">

                    <div className="planner-selected-date-header">

                        <h3>
                            {formatDate(selectedDate)}
                        </h3>

                        <span>
                            {selectedDatePlans.length} workout(s)
                        </span>

                    </div>


                    {selectedDatePlans.length === 0 ? (

                        <p className="planner-calendar-no-plans">
                            No workouts scheduled for this date.
                        </p>

                    ) : (

                        <div className="planner-calendar-plans">

                            {selectedDatePlans.map((plan) => (

                                <div
                                    className="planner-calendar-plan"
                                    key={plan.id}
                                >

                                    <div>

                                        <h4>{plan.title}</h4>

                                        <p>
                                            {plan.description ||
                                                "No description provided."}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(plan)}
                                    >
                                        Edit
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>


            {/* ==================================
                WORKOUT PLAN LIST
            ================================== */}

            <div className="planner-list-section">

                <div className="planner-section-header">

                    <h2>Scheduled Workouts</h2>

                    <p>
                        View and manage your workout schedule.
                    </p>

                </div>


                {loading ? (

                    <div className="planner-empty">
                        Loading workout plans...
                    </div>

                ) : sortedPlans.length === 0 ? (

                    <div className="planner-empty">

                        <h3>No workout plans yet</h3>

                        <p>
                            Create your first workout plan to get started.
                        </p>

                    </div>

                ) : (

                    <div className="planner-list">

                        {sortedPlans.map((plan) => (

                            <div
                                className="planner-card"
                                key={plan.id}
                            >

                                <div className="planner-card-date">

                                    <span>
                                        {formatDate(plan.scheduled_date)}
                                    </span>

                                </div>


                                <div className="planner-card-content">

                                    <h3>{plan.title}</h3>

                                    <p>
                                        {plan.description ||
                                            "No description provided."}
                                    </p>

                                    <span
                                        className={
                                            plan.scheduled_date < today
                                                ? "planner-status completed"
                                                : "planner-status upcoming"
                                        }
                                    >

                                        {plan.scheduled_date < today
                                            ? "Past Schedule"
                                            : plan.scheduled_date === today
                                                ? "Scheduled Today"
                                                : "Upcoming"}

                                    </span>

                                </div>


                                <div className="planner-card-actions">

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(plan)}
                                        className="planner-edit-btn"
                                    >
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => handleDelete(plan.id)}
                                        className="planner-delete-btn"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default WorkoutPlans;