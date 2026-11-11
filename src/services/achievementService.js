import api from "./api";

// ==========================================
// GET USER ACHIEVEMENTS
// ==========================================

export const getAchievements = async () => {
    const response = await api.get("/achievements/");
    return response.data;
};