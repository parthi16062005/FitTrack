from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

from models import (
    User,
    Workout,
    Progress,
    Goal,
    Notification,
    WorkoutPlan,
    Exercise,
    ProgressComparison,
    WorkoutStreak,
    AchievementBadge,
    Meal,
    WaterTracking,
    Reminder
)

from routers import (
    auth_router,
    workout_router,
    progress_router,
    goal_router,
    analytics_router,
    notification_router,
    workout_plan_router,
    exercise_router,
    progress_comparison_router,
    streak_router,
    achievement_router,
    personalized_dashboard_router,
    nutrition_router,
    water_router,
    ai_suggestion_router,
    workout_session_router,
    reminder_router
)

# =====================================
# CREATE DATABASE TABLES
# =====================================

Base.metadata.create_all(bind=engine)


# =====================================
# FASTAPI APPLICATION
# =====================================

app = FastAPI(
    title="FitTrack API",
    description="Fitness and Workout Management Platform",
    version="1.0.0"
)


# =====================================
# CORS CONFIGURATION
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================
# REGISTER ROUTERS
# =====================================

# =====================================
# REGISTER ROUTERS
# =====================================
app.include_router(auth_router.router)
app.include_router(workout_router.router)
app.include_router(progress_router.router)
app.include_router(goal_router.router)
app.include_router(analytics_router.router)
app.include_router(notification_router.router)
app.include_router(workout_plan_router.router)
app.include_router(exercise_router.router)
app.include_router(progress_comparison_router.router)
app.include_router(streak_router.router)
app.include_router(achievement_router.router)
app.include_router(personalized_dashboard_router.router)
app.include_router(nutrition_router.router)
app.include_router(water_router.router)
app.include_router(ai_suggestion_router.router)
app.include_router(workout_session_router.router)
app.include_router(reminder_router.router)

# =====================================
# ROOT ENDPOINT
# =====================================

@app.get("/")
def home():
    return {
        "message": "Welcome to FitTrack API",
        "status": "Running",
        "version": "1.0.0"
    }


# =====================================
# HEALTH CHECK
# =====================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "FitTrack"
    }