import api from "./api";

// ==========================================
// GET WEEKLY PROGRESS COMPARISON
// ==========================================

export const getWeeklyComparison = async () => {

    const response = await api.get(
        "/progress-comparison/weekly"
    );

    return response.data;

};


// ==========================================
// GET MONTHLY PROGRESS COMPARISON
// ==========================================

export const getMonthlyComparison = async () => {

    const response = await api.get(
        "/progress-comparison/monthly"
    );

    return response.data;

};