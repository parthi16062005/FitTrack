import { useEffect, useState } from "react";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../services/notificationService";

import "../style/Notifications.css";


function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);


    // =====================================
    // FETCH NOTIFICATIONS
    // =====================================

    const fetchNotifications = async () => {

        try {
            setLoading(true);
            setError("");

            const data = await getNotifications();

            setNotifications(data);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);


    // =====================================
    // UNREAD COUNT
    // =====================================

    const unreadCount = notifications.filter(
        notification => !notification.is_read
    ).length;


    // =====================================
    // MARK INDIVIDUAL AS READ
    // =====================================

    const handleMarkAsRead = async (id) => {

        try {
            setActionLoading(true);

            await markNotificationAsRead(id);

            setNotifications(previous =>
                previous.map(notification =>
                    notification.id === id
                        ? { ...notification, is_read: true }
                        : notification
                )
            );

        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Unable to update notification."
            );
        } finally {
            setActionLoading(false);
        }
    };


    // =====================================
    // MARK ALL AS READ
    // =====================================

    const handleMarkAllAsRead = async () => {

        try {
            setActionLoading(true);

            await markAllNotificationsAsRead();

            setNotifications(previous =>
                previous.map(notification => ({
                    ...notification,
                    is_read: true
                }))
            );

        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Unable to update notifications."
            );
        } finally {
            setActionLoading(false);
        }
    };


    // =====================================
    // DELETE NOTIFICATION
    // =====================================

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this notification?")) {
            return;
        }

        try {
            setActionLoading(true);

            await deleteNotification(id);

            setNotifications(previous =>
                previous.filter(notification => notification.id !== id)
            );

        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Unable to delete notification."
            );
        } finally {
            setActionLoading(false);
        }
    };


    // =====================================
    // FORMAT DATE
    // =====================================

    const formatDate = (value) => {

        if (!value) return "Date unavailable";

        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // =====================================
    // NOTIFICATION TYPE
    // =====================================

    const getTypeLabel = (type) => {

        const labels = {
            WORKOUT: "Workout",
            GOAL: "Goal",
            REMINDER: "Reminder",
            GENERAL: "General"
        };

        return labels[type] || type;
    };


    // =====================================
    // RENDER
    // =====================================

    return (

        <div className="notifications-page">

            <div className="notifications-header">

                <div>
                    <h1>Notifications</h1>

                    <p>
                        Stay updated with your fitness activities.
                    </p>
                </div>

                <button
                    className="notification-refresh-btn"
                    onClick={fetchNotifications}
                    disabled={loading}
                >
                    Refresh
                </button>

            </div>


            {/* SUMMARY */}

            <div className="notification-summary">

                <div className="notification-summary-card">

                    <span>Total Notifications</span>

                    <h2>{notifications.length}</h2>

                </div>


                <div className="notification-summary-card">

                    <span>Unread Notifications</span>

                    <h2>{unreadCount}</h2>

                </div>


                <div className="notification-summary-card">

                    <span>Read Notifications</span>

                    <h2>{notifications.length - unreadCount}</h2>

                </div>

            </div>


            {/* NOTIFICATION LIST HEADER */}

            <div className="notification-list-header">

                <div>
                    <h2>Recent Notifications</h2>

                    <p>
                        {unreadCount} unread notification(s)
                    </p>
                </div>

                {unreadCount > 0 && (

                    <button
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                        disabled={actionLoading}
                    >
                        Mark All as Read
                    </button>

                )}

            </div>


            {/* LOADING */}

            {loading && (

                <div className="notification-message">
                    Loading notifications...
                </div>

            )}


            {/* ERROR */}

            {!loading && error && (

                <div className="notification-error">
                    {error}

                    <button onClick={fetchNotifications}>
                        Try Again
                    </button>
                </div>

            )}


            {/* EMPTY STATE */}

            {!loading && !error && notifications.length === 0 && (

                <div className="notification-empty">

                    <h3>No Notifications Yet</h3>

                    <p>
                        Your workout reminders, goal alerts and
                        other updates will appear here.
                    </p>

                </div>

            )}


            {/* NOTIFICATION ITEMS */}

            {!loading && !error && notifications.length > 0 && (

                <div className="notification-list">

                    {notifications.map(notification => (

                        <div
                            key={notification.id}
                            className={`notification-item ${
                                notification.is_read ? "read" : "unread"
                            }`}
                        >

                            <div className="notification-item-content">

                                <div className="notification-item-top">

                                    <h3>{notification.title}</h3>

                                    <span className={`notification-type ${String(notification.notification_type).toLowerCase()}`}>
                                        {getTypeLabel(notification.notification_type)}
                                    </span>

                                </div>


                                <p className="notification-description">
                                    {notification.message}
                                </p>


                                <span className="notification-date">
                                    {formatDate(notification.created_at)}
                                </span>

                            </div>


                            <div className="notification-actions">

                                {!notification.is_read && (

                                    <button
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                        disabled={actionLoading}
                                    >
                                        Mark as Read
                                    </button>

                                )}

                                <button
                                    className="notification-delete-btn"
                                    onClick={() =>
                                        handleDelete(notification.id)
                                    }
                                    disabled={actionLoading}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Notifications;