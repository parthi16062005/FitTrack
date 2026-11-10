import api from "./api";

// ==========================================
// GET DAILY PROGRESS
// ==========================================

export const getDailyProgress = async (progressDate) => {
    const response = await api.get("/progress/", {
        params: {
            progress_date: progressDate
        }
    });

    return response.data;
};