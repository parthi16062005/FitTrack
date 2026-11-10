import API from "./api";


// Get all notifications
export const getNotifications = async () => {
    const response = await API.get("/notifications/");
    return response.data;
};


// Get unread notification count
export const getUnreadNotificationCount = async () => {
    const response = await API.get("/notifications/unread-count");
    return response.data;
};


// Mark individual notification as read
export const markNotificationAsRead = async (notificationId) => {
    const response = await API.patch(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};


// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    const response = await API.patch("/notifications/read-all");
    return response.data;
};


// Delete notification
export const deleteNotification = async (notificationId) => {
    const response = await API.delete(
        `/notifications/${notificationId}`
    );

    return response.data;
};