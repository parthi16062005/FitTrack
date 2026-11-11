import api from "./api";

// ==========================================
// GET WEEKLY ANALYTICS
// ==========================================

export const getWeeklyAnalytics = async () => {
    const response = await api.get("/analytics/weekly");
    return response.data;
};


// ==========================================
// GET MONTHLY ANALYTICS
// ==========================================

export const getMonthlyAnalytics = async () => {
    const response = await api.get("/analytics/monthly");
    return response.data;
};


// ==========================================
// GET GOAL ANALYTICS
// ==========================================

export const getGoalAnalytics = async () => {
    const response = await api.get("/analytics/goals");
    return response.data;
};


// ==========================================
// MODULE 18 - ADVANCED ANALYTICS
// ==========================================

export const getAdvancedAnalytics = async () => {
    const response = await api.get("/analytics/advanced");
    return response.data;
};