import { useEffect, useState } from "react";

import {
    getWorkoutSuggestions
} from "../services/aiSuggestionService";

import "../style/AISuggestions.css";


function AISuggestions() {

    const [suggestions, setSuggestions] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD AI WORKOUT SUGGESTIONS
    // ==========================================

    const loadSuggestions = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getWorkoutSuggestions();

            setSuggestions(data);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load workout suggestions."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadSuggestions();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="ai-loading">
                <div className="ai-spinner"></div>
                <h3>Analyzing your fitness activity...</h3>
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="ai-error">

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button onClick={loadSuggestions}>
                    Try Again
                </button>

            </div>
        );

    }


    if (!suggestions) {
        return null;
    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="ai-page">

            <div className="ai-header">

                <div>
                    <h1>AI Workout Suggestions</h1>

                    <p>
                        Personalized workout recommendations
                        based on your fitness activity.
                    </p>
                </div>

                <button
                    className="ai-refresh-btn"
                    onClick={loadSuggestions}
                >
                    Refresh Suggestions
                </button>

            </div>


            {/* RECOMMENDATION CARD */}

            <div className="ai-recommendation-card">

                <div className="ai-card-label">
                    YOUR RECOMMENDED WORKOUT
                </div>

                <h2>
                    {suggestions.recommendation}
                </h2>

                <p>
                    {suggestions.reason}
                </p>

                <div className="ai-stats">

                    <div>
                        <span>Fitness Focus</span>
                        <strong>
                            {suggestions.fitness_focus}
                        </strong>
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>
                            {suggestions.suggested_duration} min
                        </strong>
                    </div>

                    <div>
                        <span>Difficulty</span>
                        <strong>
                            {suggestions.difficulty_level}
                        </strong>
                    </div>

                </div>

            </div>


            {/* ANALYSIS SECTION */}

            <div className="ai-section">

                <h2>Recommendation Analysis</h2>

                <p>
                    Your recommendations are based on:
                </p>

                <div className="ai-analysis-list">

                    {suggestions.based_on.map(
                        (item, index) => (

                            <div
                                className="ai-analysis-item"
                                key={index}
                            >
                                <span className="ai-check">
                                    ✓
                                </span>

                                {item}

                            </div>

                        )
                    )}

                </div>

            </div>


            {/* EXERCISE SUGGESTIONS */}

            <div className="ai-section">

                <h2>Suggested Exercises</h2>

                <p>
                    Exercises selected for your fitness focus.
                </p>

                <div className="ai-exercise-grid">

                    {suggestions.suggested_exercises.length > 0 ? (

                        suggestions.suggested_exercises.map(
                            (exercise, index) => (

                                <div
                                    className="ai-exercise-card"
                                    key={index}
                                >

                                    <h3>
                                        {exercise.exercise_name}
                                    </h3>

                                    <span className="ai-category">
                                        {exercise.category}
                                    </span>

                                    <div className="ai-exercise-details">

                                        <p>
                                            <strong>Muscle:</strong>{" "}
                                            {exercise.muscle_group}
                                        </p>

                                        <p>
                                            <strong>Difficulty:</strong>{" "}
                                            {exercise.difficulty}
                                        </p>

                                    </div>

                                    <p className="ai-exercise-reason">
                                        {exercise.reason}
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <div className="ai-empty">
                            No exercises available in the Exercise Library.
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default AISuggestions;