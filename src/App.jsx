import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import WorkoutPlans from "./pages/WorkoutPlans";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ProgressComparison from "./pages/ProgressComparison";
import Streaks from "./pages/Streaks";
import Achievements from "./pages/Achievements";
import PersonalizedDashboard from "./pages/PersonalizedDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";


// ==========================================
// PROTECTED APPLICATION LAYOUT
// ==========================================

function AppLayout() {

    return (

        <div className="app-layout">

            <Sidebar />

            <main className="app-main-content">
                <Outlet />
            </main>

        </div>

    );

}


// ==========================================
// MAIN APP
// ==========================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* DEFAULT ROUTE */}

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />


                {/* PUBLIC ROUTES */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* PROTECTED ROUTES */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<AppLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />
                        
                        <Route
                             path="/personalized-dashboard"
                             element={<PersonalizedDashboard />}
                        />
                        
                        <Route
                            path="/workouts"
                            element={<Workouts />}
                        />

                        <Route
                            path="/workout-plans"
                            element={<WorkoutPlans />}
                        />

                        <Route
                            path="/exercise-library"
                            element={<ExerciseLibrary />}
                        />

                        <Route
                            path="/progress"
                            element={<Progress />}
                        />

                        <Route
                            path="/goals"
                            element={<Goals />}
                        />

                        <Route
                            path="/progress-comparison"
                            element={<ProgressComparison />}
                        />

                        <Route
                            path="/analytics"
                            element={<Analytics />}
                        />

                        <Route
                            path="/streaks"
                            element={<Streaks />}
                        />

                        <Route
                            path="/achievements"
                            element={<Achievements />}
                        />

                        <Route
                            path="/notifications"
                            element={<Notifications />}
                        />

                    </Route>

                </Route>


                {/* INVALID ROUTES */}

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;