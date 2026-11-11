import api from "./api";

// ==========================================
// MODULE 14 - WATER TRACKING SERVICE
// ==========================================

// LOG WATER INTAKE
export const logWater = async (quantity) => {
    const response = await api.post("/water/log", {
        quantity: Number(quantity)
    });

    return response.data;
};

// GET WATER HISTORY
export const getWaterHistory = async () => {
    const response = await api.get("/water/history");

    return response.data;
};

// GET DAILY WATER SUMMARY
export const getWaterSummary = async () => {
    const response = await api.get("/water/summary");

    return response.data;
};

// DELETE WATER ENTRY
export const deleteWaterEntry = async (entryId) => {
    const response = await api.delete(
        `/water/log/${entryId}`
    );

    return response.data;
};