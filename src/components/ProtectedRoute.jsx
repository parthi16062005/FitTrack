import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const token = localStorage.getItem("fittrack_token");

    // Check authentication
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;