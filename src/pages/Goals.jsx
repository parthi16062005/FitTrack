import { useEffect, useState } from "react";

import {
getGoals,
createGoal,
updateGoal,
deleteGoal
} 

from "../services/goalService";

import "../style/Goals.css";

function Goals() {


const [goals, setGoals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [editingId, setEditingId] = useState(null);

const [form, setForm] = useState({
    goal_type: "Weight Loss",
    target_value: "",
    current_value: 0,
    unit: "kg",
    deadline: ""
});


// ==========================================
// LOAD GOALS
// ==========================================

const loadGoals = async () => {

    try {

        setLoading(true);
        setError("");

        const data = await getGoals();

        setGoals(data);

    } catch (err) {

        setError(
            err.response?.data?.detail ||
            "Unable to load goals."
        );

    } finally {

        setLoading(false);

    }

};


useEffect(() => {
    loadGoals();
}, []);


// ==========================================
// HANDLE FORM CHANGES
// ==========================================

const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));

};


// ==========================================
// CHANGE UNIT BASED ON GOAL TYPE
// ==========================================

const handleGoalTypeChange = (e) => {

    const goalType = e.target.value;

    setForm((previous) => ({
        ...previous,
        goal_type: goalType,
        unit: goalType === "Steps" ? "steps" : "kg"
    }));

};


// ==========================================
// RESET FORM
// ==========================================

const resetForm = () => {

    setForm({
        goal_type: "Weight Loss",
        target_value: "",
        current_value: 0,
        unit: "kg",
        deadline: ""
    });

    setEditingId(null);

};


// ==========================================
// CREATE / UPDATE GOAL
// ==========================================

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setError("");

        const goalData = {
            ...form,
            target_value: Number(form.target_value),
            current_value: Number(form.current_value)
        };

        if (editingId) {

            await updateGoal(editingId, goalData);

        } else {

            await createGoal(goalData);

        }

        resetForm();

        await loadGoals();

    } catch (err) {

        setError(
            err.response?.data?.detail ||
            "Unable to save goal."
        );

    }

};


// ==========================================
// EDIT GOAL
// ==========================================

const handleEdit = (goal) => {

    setEditingId(goal.id);

    setForm({
        goal_type: goal.goal_type,
        target_value: goal.target_value,
        current_value: goal.current_value,
        unit: goal.unit,
        deadline: goal.deadline
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};


// ==========================================
// DELETE GOAL
// ==========================================

const handleDelete = async (goalId) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {

        await deleteGoal(goalId);

        await loadGoals();

    } catch (err) {

        setError(
            err.response?.data?.detail ||
            "Unable to delete goal."
        );

    }

};


// ==========================================
// FORMAT DATE
// ==========================================

const formatDate = (date) => {

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

};


// ==========================================
// GOAL STATISTICS
// ==========================================

const totalGoals = goals.length;

const activeGoals = goals.filter(
    (goal) => goal.status === "ACTIVE"
).length;

const completedGoals = goals.filter(
    (goal) => goal.status === "COMPLETED"
).length;


// ==========================================
// PAGE UI
// ==========================================

return (

    <div className="goals-page">

        <div className="goals-header">

            <div>
                <h1>Goal Setting</h1>

                <p>
                    Set fitness targets and track your progress.
                </p>
            </div>

        </div>


        {/* STATISTICS */}

        <div className="goals-statistics">

            <div className="goal-stat-card">
                <span>Total Goals</span>
                <h2>{totalGoals}</h2>
            </div>

            <div className="goal-stat-card">
                <span>Active Goals</span>
                <h2>{activeGoals}</h2>
            </div>

            <div className="goal-stat-card">
                <span>Completed Goals</span>
                <h2>{completedGoals}</h2>
            </div>

        </div>


        {/* ERROR */}

        {error && (
            <div className="goals-error">
                {error}
            </div>
        )}


        {/* GOAL FORM */}

        <div className="goal-form-card">

            <h2>
                {editingId ? "Update Goal" : "Create New Goal"}
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="goal-form-grid">

                    <div className="goal-form-group">

                        <label>Goal Type</label>

                        <select
                            name="goal_type"
                            value={form.goal_type}
                            onChange={handleGoalTypeChange}
                        >
                            <option value="Weight Loss">
                                Weight Loss
                            </option>

                            <option value="Muscle Gain">
                                Muscle Gain
                            </option>

                            <option value="Steps">
                                Steps
                            </option>

                        </select>

                    </div>


                    <div className="goal-form-group">

                        <label>Target Value</label>

                        <input
                            type="number"
                            name="target_value"
                            min="0.01"
                            step="any"
                            value={form.target_value}
                            onChange={handleChange}
                            placeholder="Enter target value"
                            required
                        />

                    </div>


                    <div className="goal-form-group">

                        <label>Current Value</label>

                        <input
                            type="number"
                            name="current_value"
                            min="0"
                            step="any"
                            value={form.current_value}
                            onChange={handleChange}
                            placeholder="Enter current value"
                            required
                        />

                    </div>


                    <div className="goal-form-group">

                        <label>Unit</label>

                        <input
                            type="text"
                            value={form.unit}
                            readOnly
                        />

                    </div>


                    <div className="goal-form-group">

                        <label>Deadline</label>

                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            min={new Date().toLocaleDateString("en-CA")}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>


                <div className="goal-form-actions">

                    <button
                        type="submit"
                        className="goal-submit-button"
                    >
                        {editingId ? "Update Goal" : "Create Goal"}
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            className="goal-cancel-button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

        </div>


        {/* GOAL LIST */}

        <div className="goal-list-section">

            <div className="goal-list-heading">
                <h2>My Fitness Goals</h2>
                <span>{totalGoals} Goals</span>
            </div>


            {loading ? (

                <div className="goals-loading">
                    Loading goals...
                </div>

            ) : goals.length === 0 ? (

                <div className="goals-empty">
                    <h3>No Goals Created Yet</h3>

                    <p>
                        Create your first fitness goal to start tracking progress.
                    </p>
                </div>

            ) : (

                <div className="goals-grid">

                    {goals.map((goal) => {

                        const percentage = Math.min(
                            100,
                            Math.round(
                                (goal.current_value / goal.target_value) * 100
                            )
                        );

                        return (

                            <div
                                className="goal-card"
                                key={goal.id}
                            >

                                <div className="goal-card-header">

                                    <div>
                                        <h3>{goal.goal_type}</h3>

                                        <p>
                                            Deadline: {formatDate(goal.deadline)}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            goal.status === "COMPLETED"
                                                ? "goal-status completed"
                                                : "goal-status active"
                                        }
                                    >
                                        {goal.status}
                                    </span>

                                </div>


                                <div className="goal-values">

                                    <div>
                                        <span>Current</span>

                                        <strong>
                                            {goal.current_value} {goal.unit}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Target</span>

                                        <strong>
                                            {goal.target_value} {goal.unit}
                                        </strong>
                                    </div>

                                </div>


                                <div className="goal-progress-info">

                                    <span>Progress</span>

                                    <strong>{percentage}%</strong>

                                </div>


                                <div className="goal-progress-bar">

                                    <div
                                        className="goal-progress-fill"
                                        style={{
                                            width: `${percentage}%`
                                        }}
                                    />

                                </div>


                                <div className="goal-card-actions">

                                    <button
                                        onClick={() => handleEdit(goal)}
                                        className="goal-edit-button"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="goal-delete-button"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    </div>

);


}

export default Goals;
