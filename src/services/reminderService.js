import api from "./api";

// Create Reminder
export const createReminder = async (data) => {
    const response = await api.post("/reminders/", data);
    return response.data;
};

// Get All Reminders
export const getReminders = async () => {
    const response = await api.get("/reminders/");
    return response.data;
};

// Get Upcoming Reminders
export const getUpcomingReminders = async () => {
    const response = await api.get("/reminders/upcoming");
    return response.data;
};

// Update Reminder
export const updateReminder = async (id, data) => {
    const response = await api.patch(`/reminders/${id}`, data);
    return response.data;
};

// Complete Reminder
export const completeReminder = async (id) => {
    const response = await api.patch(`/reminders/${id}/complete`);
    return response.data;
};

// Delete Reminder
export const deleteReminder = async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
};