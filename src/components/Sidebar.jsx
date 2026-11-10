import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { getUnreadNotificationCount } from "../services/notificationService";

import "../style/Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_user");

        navigate("/login", { replace: true });

    };


    // ==========================================
    // FETCH UNREAD NOTIFICATION COUNT
    // ==========================================

    useEffect(() => {

        const fetchUnreadCount = async () => {

            try {

                const data = await getUnreadNotificationCount();

                setUnreadCount(data.unread_count || 0);

            } catch (error) {

                console.error(
                    "Unable to fetch notification count:",
                    error
                );

            }

        };

        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);

    }, []);


    // ==========================================
    // NAVIGATION ITEMS
    // ==========================================

    const navigationItems = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "D"
        },
        
        {
             name: "Personalized Dashboard",
             path: "/personalized-dashboard",
             icon: "P"
        },
        
        {
            name: "Workouts",
            path: "/workouts",
            icon: "W"
        },

        {
            name: "Workout Planner",
            path: "/workout-plans",
            icon: "S"
        },

        {
            name: "Exercise Library",
            path: "/exercise-library",
            icon: "E"
        },

        {
            name: "Daily Progress",
            path: "/progress",
            icon: "P"
        },

        {
            name: "My Goals",
            path: "/goals",
            icon: "G"
        },

        {
            name: "Progress Comparison",
            path: "/progress-comparison",
            icon: "C"
        },

        {
            name: "Workout Streaks",
            path: "/streaks",
            icon: "S"
        },
         
        {
            name: "Analytics",
            path: "/analytics",
            icon: "A"
        },

        {
            name: "Achievement Badges",
            path: "/achievements",
            icon: "B"
        },

        {
            name: "Notifications",
            path: "/notifications",
            icon: "N"
        }

    ];


    // ==========================================
    // SIDEBAR UI
    // ==========================================

    return (

        <aside className="sidebar">


            {/* LOGO */}

            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    F
                </div>

                <h2>FitTrack</h2>

            </div>


            {/* NAVIGATION */}

            <div className="sidebar-section">

                <p className="sidebar-label">
                    MENU
                </p>

                <nav className="sidebar-navigation">

                    {navigationItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>


                            {/* NOTIFICATION BADGE */}

                            {item.path === "/notifications" &&
                                unreadCount > 0 && (

                                    <span className="sidebar-notification-badge">

                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}

                                    </span>

                                )}

                        </NavLink>

                    ))}

                </nav>

            </div>


            {/* BOTTOM SECTION */}

            <div className="sidebar-bottom">

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

                <p className="sidebar-version">
                    FitTrack v1.0.0
                </p>

            </div>


        </aside>

    );

}

export default Sidebar;