import api from "./api";

// ==========================================
// MODULE 15 - AI WORKOUT SUGGESTIONS
// ==========================================

export const getWorkoutSuggestions = async () => {

    const response = await api.get(
        "/ai-suggestions/"
    );

    return response.data;
};