import api from "./api";

// ==========================================
// GET WORKOUT STREAK
// ==========================================

export const getWorkoutStreak = async () => {
    const response = await api.get("/streaks/");
    return response.data;
};