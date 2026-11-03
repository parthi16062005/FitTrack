from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

# Import models before creating database tables
from models import User, Workout, Progress, Goal, Notification

from routers import (
    auth_router,
    workout_router,
    progress_router,
    goal_router,
    analytics_router,
    notification_router,
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