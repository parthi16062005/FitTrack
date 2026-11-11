import api from "./api";

// ==========================================
// GET PERSONALIZED DASHBOARD
// ==========================================

export const getPersonalizedDashboard = async () => {
    const response = await api.get("/personalized-dashboard/");
    return response.data;
};