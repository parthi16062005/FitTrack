import api from "./api";

// Get all workouts
export const getWorkouts = async () => {
    const response = await api.get("/workouts/");
    return response.data;
};

// Create workout
export const createWorkout = async (workoutData) => {
    const response = await api.post("/workouts/", workoutData);
    return response.data;
};

// Update workout
export const updateWorkout = async (workoutId, workoutData) => {
    const response = await api.put(
        `/workouts/${workoutId}`,
        workoutData
    );
    return response.data;
};

// Delete workout
export const deleteWorkout = async (workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
};