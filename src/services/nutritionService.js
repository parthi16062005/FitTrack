import api from "./api";

// ==========================================
// MODULE 13 - NUTRITION SERVICE
// ==========================================

// ADD MEAL
export const addMeal = async (mealData) => {
    const response = await api.post(
        "/nutrition/meals",
        mealData
    );

    return response.data;
};

// GET ALL MEALS
export const getMeals = async () => {
    const response = await api.get(
        "/nutrition/meals"
    );

    return response.data;
};

// GET DAILY NUTRITION SUMMARY
export const getNutritionSummary = async () => {
    const response = await api.get(
        "/nutrition/summary"
    );

    return response.data;
};

// DELETE MEAL
export const deleteMeal = async (mealId) => {
    const response = await api.delete(
        `/nutrition/meals/${mealId}`
    );

    return response.data;
};