import api from "./api";

// ==========================================
// MODULE 16 - WORKOUT TIMER SERVICE
// ==========================================

// START WORKOUT
export const startWorkout = async (data) => {
    const response = await api.post(
        "/workout-sessions/start",
        data
    );

    return response.data;
};


// PAUSE WORKOUT
export const pauseWorkout = async (sessionId) => {
    const response = await api.post(
        `/workout-sessions/${sessionId}/pause`
    );

    return response.data;
};


// RESUME WORKOUT
export const resumeWorkout = async (sessionId) => {
    const response = await api.post(
        `/workout-sessions/${sessionId}/resume`
    );

    return response.data;
};


// STOP WORKOUT
export const stopWorkout = async (sessionId) => {
    const response = await api.post(
        `/workout-sessions/${sessionId}/stop`
    );

    return response.data;
};


// GET ACTIVE WORKOUT
export const getActiveWorkout = async () => {
    const response = await api.get(
        "/workout-sessions/active"
    );

    return response.data;
};


// GET WORKOUT HISTORY
export const getWorkoutHistory = async () => {
    const response = await api.get(
        "/workout-sessions/history"
    );

    return response.data;
};