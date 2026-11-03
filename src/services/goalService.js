import api from "./api";

// Get all goals
export const getGoals = async () => {
    const response = await api.get("/goals/");
    return response.data;
};

// Create goal
export const createGoal = async (goalData) => {
    const response = await api.post("/goals/", goalData);
    return response.data;
};

// Update goal
export const updateGoal = async (goalId, goalData) => {
    const response = await api.put(
        `/goals/${goalId}`,
        goalData
    );
    return response.data;
};

// Delete goal
export const deleteGoal = async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
};

// Get single goal
export const getGoalById = async (goalId) => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
};