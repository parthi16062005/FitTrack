from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database import get_db

from models import (
    Workout,
    Goal,
    WorkoutStreak,
    AchievementBadge,
    User
)

from auth import get_current_user


router = APIRouter(
    prefix="/personalized-dashboard",
    tags=["Personalized Dashboard"]
)


# ==========================================
# GET PERSONALIZED DASHBOARD
# ==========================================

@router.get("/")
def get_personalized_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    user_id = current_user.id

    # --------------------------------------
    # WORKOUT STATISTICS
    # --------------------------------------

    workout_stats = (
        db.query(
            func.count(Workout.id).label("total_workouts"),
            func.coalesce(
                func.sum(Workout.calories_burned), 0
            ).label("total_calories"),
            func.coalesce(
                func.sum(Workout.duration), 0
            ).label("total_duration")
        )
        .filter(Workout.user_id == user_id)
        .first()
    )

    # --------------------------------------
    # GOAL STATISTICS
    # --------------------------------------

    total_goals = (
        db.query(Goal)
        .filter(Goal.user_id == user_id)
        .count()
    )

    completed_goals = (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.status == "COMPLETED"
        )
        .count()
    )

    # --------------------------------------
    # STREAK STATISTICS
    # --------------------------------------

    streak = (
        db.query(WorkoutStreak)
        .filter(WorkoutStreak.user_id == user_id)
        .first()
    )

    current_streak = streak.current_streak if streak else 0
    longest_streak = streak.longest_streak if streak else 0

    # --------------------------------------
    # ACHIEVEMENT STATISTICS
    # --------------------------------------

    total_badges = (
        db.query(AchievementBadge)
        .filter(AchievementBadge.user_id == user_id)
        .count()
    )

    # --------------------------------------
    # RECENT WORKOUTS
    # --------------------------------------

    recent_workouts = (
        db.query(Workout)
        .filter(Workout.user_id == user_id)
        .order_by(desc(Workout.workout_date))
        .limit(5)
        .all()
    )

    recent_workout_data = [
        {
            "id": workout.id,
            "workout_name": workout.workout_name,
            "category": workout.category,
            "duration": workout.duration,
            "calories_burned": workout.calories_burned,
            "workout_date": workout.workout_date
        }
        for workout in recent_workouts
    ]

    # --------------------------------------
    # FINAL DASHBOARD RESPONSE
    # --------------------------------------

    return {
        "username": current_user.username,

        "total_workouts": workout_stats.total_workouts,
        "total_calories": workout_stats.total_calories,
        "total_duration": workout_stats.total_duration,

        "total_goals": total_goals,
        "completed_goals": completed_goals,

        "goal_completion_percentage": (
            round((completed_goals / total_goals) * 100, 2)
            if total_goals > 0 else 0
        ),

        "current_streak": current_streak,
        "longest_streak": longest_streak,

        "total_badges": total_badges,

        "recent_workouts": recent_workout_data
    }