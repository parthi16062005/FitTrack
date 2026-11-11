import API from "./api";

// ==========================================
// CREATE WORKOUT PLAN
// ==========================================

export const createWorkoutPlan = async (planData) => {
    const response = await API.post(
        "/workout-plans/",
        planData
    );

    return response.data;
};


// ==========================================
// GET ALL WORKOUT PLANS
// ==========================================

export const getWorkoutPlans = async () => {
    const response = await API.get("/workout-plans/");

    return response.data;
};


// ==========================================
// GET UPCOMING WORKOUT PLANS
// ==========================================

export const getUpcomingWorkoutPlans = async () => {
    const response = await API.get("/workout-plans/upcoming");

    return response.data;
};


// ==========================================
// UPDATE WORKOUT PLAN
// ==========================================

export const updateWorkoutPlan = async (planId, planData) => {
    const response = await API.put(
        `/workout-plans/${planId}`,
        planData
    );

    return response.data;
};


// ==========================================
// DELETE WORKOUT PLAN
// ==========================================

export const deleteWorkoutPlan = async (planId) => {
    const response = await API.delete(
        `/workout-plans/${planId}`
    );

    return response.data;
};