import { useEffect, useState } from "react";

import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise
} from "../services/exerciseService";

import "../style/ExerciseLibrary.css";


const initialForm = {
    exercise_name: "",
    category: "Strength",
    muscle_group: "",
    equipment: "None",
    difficulty: "Beginner",
    description: "",
    instructions: "",
    image_url: ""
};


function ExerciseLibrary() {

    const [exercises, setExercises] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD EXERCISES
    // ==========================================

    const loadExercises = async () => {

        try {

            setLoading(true);
            setError("");

            const filters = {
                search: search.trim(),
                category,
                muscle_group: muscleGroup,
                difficulty
            };

            Object.keys(filters).forEach((key) => {
                if (!filters[key]) {
                    delete filters[key];
                }
            });

            const data = await getExercises(filters);

            setExercises(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load exercises."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const timer = setTimeout(() => {
            loadExercises();
        }, 300);

        return () => clearTimeout(timer);

    }, [search, category, muscleGroup, difficulty]);


    // ==========================================
    // HANDLE FORM INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setForm(initialForm);
        setEditingId(null);

    };


    // ==========================================
    // CREATE / UPDATE EXERCISE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const exerciseData = {
                ...form,
                exercise_name: form.exercise_name.trim(),
                category: form.category.trim(),
                muscle_group: form.muscle_group.trim(),
                equipment: form.equipment.trim(),
                description: form.description.trim() || null,
                instructions: form.instructions.trim(),
                image_url: form.image_url.trim() || null
            };

            if (editingId) {

                await updateExercise(
                    editingId,
                    exerciseData
                );

                setSuccess("Exercise updated successfully!");

            } else {

                await createExercise(exerciseData);

                setSuccess("Exercise added successfully!");

            }

            resetForm();

            await loadExercises();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to save exercise."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // EDIT EXERCISE
    // ==========================================

    const handleEdit = (exercise) => {

        setEditingId(exercise.id);

        setForm({
            exercise_name: exercise.exercise_name,
            category: exercise.category,
            muscle_group: exercise.muscle_group,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
            description: exercise.description || "",
            instructions: exercise.instructions,
            image_url: exercise.image_url || ""
        });

        setSuccess("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // DELETE EXERCISE
    // ==========================================

    const handleDelete = async (exerciseId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this exercise?"
        );

        if (!confirmed) return;

        try {

            setError("");
            setSuccess("");

            await deleteExercise(exerciseId);

            setSuccess("Exercise deleted successfully!");

            if (editingId === exerciseId) {
                resetForm();
            }

            await loadExercises();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to delete exercise."
            );

        }

    };


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");
        setCategory("");
        setMuscleGroup("");
        setDifficulty("");

    };


    // ==========================================
    // PAGE UI
    // ==========================================

    return (

        <div className="exercise-library-page">

            {/* PAGE HEADER */}

            <div className="exercise-header">

                <div>

                    <span className="exercise-eyebrow">
                        FITNESS RESOURCES
                    </span>

                    <h1>Exercise Library</h1>

                    <p>
                        Explore, search and manage your exercises.
                    </p>

                </div>

                <div className="exercise-total">

                    <span>Total Exercises</span>

                    <strong>{exercises.length}</strong>

                </div>

            </div>


            {/* ALERT MESSAGES */}

            {error && (

                <div className="exercise-alert error-alert">
                    {error}
                </div>

            )}

            {success && (

                <div className="exercise-alert success-alert">
                    {success}
                </div>

            )}


            {/* EXERCISE FORM */}

            <section className="exercise-form-card">

                <div className="exercise-section-heading">

                    <div>

                        <h2>
                            {editingId
                                ? "Update Exercise"
                                : "Add New Exercise"}
                        </h2>

                        <p>
                            Enter exercise information below.
                        </p>

                    </div>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="exercise-form-grid">

                        <div className="exercise-field">

                            <label>Exercise Name</label>

                            <input
                                type="text"
                                name="exercise_name"
                                value={form.exercise_name}
                                onChange={handleChange}
                                placeholder="Example: Push Up"
                                minLength={2}
                                maxLength={150}
                                required
                            />

                        </div>


                        <div className="exercise-field">

                            <label>Category</label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="Strength">Strength</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Flexibility">Flexibility</option>
                                <option value="Core">Core</option>

                            </select>

                        </div>


                        <div className="exercise-field">

                            <label>Muscle Group</label>

                            <input
                                type="text"
                                name="muscle_group"
                                value={form.muscle_group}
                                onChange={handleChange}
                                placeholder="Example: Chest"
                                required
                            />

                        </div>


                        <div className="exercise-field">

                            <label>Equipment</label>

                            <input
                                type="text"
                                name="equipment"
                                value={form.equipment}
                                onChange={handleChange}
                                placeholder="Example: Dumbbell / None"
                                required
                            />

                        </div>


                        <div className="exercise-field">

                            <label>Difficulty</label>

                            <select
                                name="difficulty"
                                value={form.difficulty}
                                onChange={handleChange}
                                required
                            >

                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>

                            </select>

                        </div>


                        <div className="exercise-field">

                            <label>Image URL</label>

                            <input
                                type="url"
                                name="image_url"
                                value={form.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />

                        </div>


                        <div className="exercise-field full-width">

                            <label>Description</label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the exercise..."
                                rows="3"
                                maxLength={2000}
                            />

                        </div>


                        <div className="exercise-field full-width">

                            <label>Instructions</label>

                            <textarea
                                name="instructions"
                                value={form.instructions}
                                onChange={handleChange}
                                placeholder="Explain how to perform this exercise..."
                                rows="4"
                                minLength={5}
                                required
                            />

                        </div>

                    </div>


                    <div className="exercise-form-actions">

                        <button
                            type="submit"
                            className="exercise-submit-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Exercise"
                                    : "Add Exercise"}

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="exercise-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </section>


            {/* SEARCH AND FILTERS */}

            <section className="exercise-filter-card">

                <div className="exercise-section-heading">

                    <div>

                        <h2>Find Exercises</h2>

                        <p>
                            Search and filter your exercise library.
                        </p>

                    </div>

                </div>


                <div className="exercise-filter-grid">

                    <input
                        type="text"
                        placeholder="Search exercise name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />


                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option value="">All Categories</option>
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="Core">Core</option>

                    </select>


                    <input
                        type="text"
                        placeholder="Muscle group..."
                        value={muscleGroup}
                        onChange={(e) => setMuscleGroup(e.target.value)}
                    />


                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >

                        <option value="">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>

                    </select>


                    <button
                        type="button"
                        className="exercise-clear-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            </section>


            {/* EXERCISE LIST */}

            <section className="exercise-list-section">

                <div className="exercise-section-heading">

                    <div>

                        <h2>Available Exercises</h2>

                        <p>
                            {exercises.length} exercise(s) found
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="exercise-empty">
                        Loading exercises...
                    </div>

                ) : exercises.length === 0 ? (

                    <div className="exercise-empty">

                        <h3>No Exercises Found</h3>

                        <p>
                            Add an exercise or change your search filters.
                        </p>

                    </div>

                ) : (

                    <div className="exercise-grid">

                        {exercises.map((exercise) => (

                            <div
                                className="exercise-card"
                                key={exercise.id}
                            >

                                {exercise.image_url ? (

                                    <img
                                        src={exercise.image_url}
                                        alt={exercise.exercise_name}
                                        className="exercise-image"
                                    />

                                ) : (

                                    <div className="exercise-image-placeholder">
                                        {exercise.exercise_name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                )}


                                <div className="exercise-card-content">

                                    <div className="exercise-card-top">

                                        <span className="exercise-category">
                                            {exercise.category}
                                        </span>

                                        <span
                                            className={`difficulty-badge ${exercise.difficulty.toLowerCase()}`}
                                        >
                                            {exercise.difficulty}
                                        </span>

                                    </div>


                                    <h3>{exercise.exercise_name}</h3>

                                    <p className="exercise-description">
                                        {exercise.description ||
                                            "No description available."}
                                    </p>


                                    <div className="exercise-details">

                                        <div>
                                            <span>Muscle Group</span>
                                            <strong>{exercise.muscle_group}</strong>
                                        </div>

                                        <div>
                                            <span>Equipment</span>
                                            <strong>{exercise.equipment}</strong>
                                        </div>

                                    </div>


                                    <div className="exercise-instructions">

                                        <strong>Instructions</strong>

                                        <p>{exercise.instructions}</p>

                                    </div>


                                    <div className="exercise-card-actions">

                                        <button
                                            type="button"
                                            className="exercise-edit-btn"
                                            onClick={() => handleEdit(exercise)}
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="exercise-delete-btn"
                                            onClick={() => handleDelete(exercise.id)}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>

    );

}

export default ExerciseLibrary;