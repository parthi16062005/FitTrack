import api from "./api";

// ==========================================
// MODULE 8 - EXERCISE LIBRARY SERVICE
// ==========================================

// GET ALL EXERCISES
export const getExercises = async (filters = {}) => {
    const response = await api.get("/exercises/", {
        params: filters
    });

    return response.data;
};


// GET EXERCISE BY ID
export const getExerciseById = async (exerciseId) => {
    const response = await api.get(
        `/exercises/${exerciseId}`
    );

    return response.data;
};


// CREATE EXERCISE
export const createExercise = async (exerciseData) => {
    const response = await api.post(
        "/exercises/",
        exerciseData
    );

    return response.data;
};


// UPDATE EXERCISE
export const updateExercise = async (
    exerciseId,
    exerciseData
) => {
    const response = await api.put(
        `/exercises/${exerciseId}`,
        exerciseData
    );

    return response.data;
};


// DELETE EXERCISE
export const deleteExercise = async (exerciseId) => {
    const response = await api.delete(
        `/exercises/${exerciseId}`
    );

    return response.data;
};