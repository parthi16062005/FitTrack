import { useEffect, useState } from "react";

import {
    addMeal,
    getMeals,
    getNutritionSummary,
    deleteMeal
} from "../services/nutritionService";

import "../style/Nutrition.css";


function Nutrition() {

    const [meals, setMeals] = useState([]);

    const [summary, setSummary] = useState({
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fats: 0,
        total_meals: 0
    });

    const [formData, setFormData] = useState({
        meal_type: "Breakfast",
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD NUTRITION DATA
    // ==========================================

    const loadNutritionData = async () => {

        try {

            setLoading(true);
            setError("");

            const [mealData, summaryData] = await Promise.all([
                getMeals(),
                getNutritionSummary()
            ]);

            setMeals(mealData);
            setSummary(summaryData);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to load nutrition data."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadNutritionData();
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
    // ADD MEAL
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setSuccess("");

            const mealData = {
                meal_type: formData.meal_type,
                food_name: formData.food_name.trim(),
                calories: Number(formData.calories),
                protein: Number(formData.protein || 0),
                carbs: Number(formData.carbs || 0),
                fats: Number(formData.fats || 0)
            };

            await addMeal(mealData);

            setSuccess("Meal added successfully!");

            setFormData({
                meal_type: "Breakfast",
                food_name: "",
                calories: "",
                protein: "",
                carbs: "",
                fats: ""
            });

            await loadNutritionData();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to add meal."
            );

        }
    };


    // ==========================================
    // DELETE MEAL
    // ==========================================

    const handleDelete = async (mealId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this meal?"
        );

        if (!confirmDelete) return;

        try {

            await deleteMeal(mealId);

            setSuccess("Meal deleted successfully!");

            await loadNutritionData();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to delete meal."
            );

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="nutrition-loading">
                Loading nutrition data...
            </div>
        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="nutrition-page">

            <div className="nutrition-header">

                <div>
                    <h1>Nutrition & Meal Tracking</h1>

                    <p>
                        Track your daily food intake and nutrition.
                    </p>
                </div>

            </div>


            {/* MESSAGES */}

            {error && (
                <div className="nutrition-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="nutrition-success">
                    {success}
                </div>
            )}


            {/* SUMMARY CARDS */}

            <div className="nutrition-summary">

                <div className="nutrition-card calories-card">
                    <h3>Total Calories</h3>
                    <h2>{Number(summary.total_calories).toFixed(0)}</h2>
                    <p>kcal consumed today</p>
                </div>

                <div className="nutrition-card protein-card">
                    <h3>Protein</h3>
                    <h2>{Number(summary.total_protein).toFixed(1)} g</h2>
                    <p>Today's protein intake</p>
                </div>

                <div className="nutrition-card carbs-card">
                    <h3>Carbohydrates</h3>
                    <h2>{Number(summary.total_carbs).toFixed(1)} g</h2>
                    <p>Today's carbohydrate intake</p>
                </div>

                <div className="nutrition-card fats-card">
                    <h3>Fats</h3>
                    <h2>{Number(summary.total_fats).toFixed(1)} g</h2>
                    <p>Today's fat intake</p>
                </div>

            </div>


            {/* ADD MEAL FORM */}

            <div className="nutrition-form-section">

                <h2>Add Meal</h2>

                <form
                    className="nutrition-form"
                    onSubmit={handleSubmit}
                >

                    <div className="nutrition-form-grid">

                        <div className="nutrition-field">

                            <label>Meal Type</label>

                            <select
                                name="meal_type"
                                value={formData.meal_type}
                                onChange={handleChange}
                            >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snacks">Snacks</option>
                            </select>

                        </div>


                        <div className="nutrition-field">

                            <label>Food Name</label>

                            <input
                                type="text"
                                name="food_name"
                                placeholder="Enter food name"
                                value={formData.food_name}
                                onChange={handleChange}
                                minLength="2"
                                maxLength="150"
                                required
                            />

                        </div>


                        <div className="nutrition-field">

                            <label>Calories (kcal)</label>

                            <input
                                type="number"
                                name="calories"
                                placeholder="Enter calories"
                                value={formData.calories}
                                onChange={handleChange}
                                min="0"
                                step="any"
                                required
                            />

                        </div>


                        <div className="nutrition-field">

                            <label>Protein (g)</label>

                            <input
                                type="number"
                                name="protein"
                                placeholder="Protein"
                                value={formData.protein}
                                onChange={handleChange}
                                min="0"
                                step="any"
                            />

                        </div>


                        <div className="nutrition-field">

                            <label>Carbohydrates (g)</label>

                            <input
                                type="number"
                                name="carbs"
                                placeholder="Carbohydrates"
                                value={formData.carbs}
                                onChange={handleChange}
                                min="0"
                                step="any"
                            />

                        </div>


                        <div className="nutrition-field">

                            <label>Fats (g)</label>

                            <input
                                type="number"
                                name="fats"
                                placeholder="Fats"
                                value={formData.fats}
                                onChange={handleChange}
                                min="0"
                                step="any"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="nutrition-add-button"
                    >
                        Add Meal
                    </button>

                </form>

            </div>


            {/* MEAL HISTORY */}

            <div className="nutrition-meals-section">

                <h2>Meal History</h2>

                {meals.length === 0 ? (

                    <div className="nutrition-empty">
                        No meals recorded yet.
                    </div>

                ) : (

                    <div className="nutrition-table-wrapper">

                        <table className="nutrition-table">

                            <thead>
                                <tr>
                                    <th>Food</th>
                                    <th>Meal Type</th>
                                    <th>Calories</th>
                                    <th>Protein</th>
                                    <th>Carbs</th>
                                    <th>Fats</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {meals.map((meal) => (

                                    <tr key={meal.id}>

                                        <td>{meal.food_name}</td>

                                        <td>
                                            <span className="meal-type-badge">
                                                {meal.meal_type}
                                            </span>
                                        </td>

                                        <td>{meal.calories} kcal</td>

                                        <td>{meal.protein} g</td>

                                        <td>{meal.carbs} g</td>

                                        <td>{meal.fats} g</td>

                                        <td>
                                            <button
                                                className="nutrition-delete-button"
                                                onClick={() => handleDelete(meal.id)}
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

export default Nutrition;