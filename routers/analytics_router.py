from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Workout, Goal, User
from schemas import (
    WorkoutAnalyticsResponse,
    GoalAnalyticsResponse
)
from auth import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Reports & Analytics"]
)


# ==========================================
# COMMON ANALYTICS FUNCTION
# ==========================================

def calculate_analytics(db, user_id, start_date, end_date):

    workouts = db.query(Workout).filter(
        Workout.user_id == user_id,
        Workout.workout_date >= start_date,
        Workout.workout_date <= end_date
    ).order_by(Workout.workout_date).all()

    daily_data = {}

    for workout in workouts:

        workout_day = workout.workout_date.isoformat()

        if workout_day not in daily_data:
            daily_data[workout_day] = {
                "date": workout.workout_date,
                "workouts": 0,
                "calories": 0,
                "duration": 0
            }

        daily_data[workout_day]["workouts"] += 1
        daily_data[workout_day]["calories"] += workout.calories_burned
        daily_data[workout_day]["duration"] += workout.duration

    return {
        "start_date": start_date,
        "end_date": end_date,
        "total_workouts": len(workouts),
        "total_calories": sum(w.calories_burned for w in workouts),
        "total_duration": sum(w.duration for w in workouts),
        "daily_breakdown": list(daily_data.values())
    }


# ==========================================
# WEEKLY ANALYTICS
# ==========================================

@router.get(
    "/weekly",
    response_model=WorkoutAnalyticsResponse
)
def get_weekly_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()
    start_date = today - timedelta(days=6)

    return calculate_analytics(
        db,
        current_user.id,
        start_date,
        today
    )


# ==========================================
# MONTHLY ANALYTICS
# ==========================================

@router.get(
    "/monthly",
    response_model=WorkoutAnalyticsResponse
)
def get_monthly_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()
    start_date = today.replace(day=1)

    return calculate_analytics(
        db,
        current_user.id,
        start_date,
        today
    )


# ==========================================
# GOAL ACHIEVEMENT ANALYTICS
# ==========================================

@router.get(
    "/goals",
    response_model=GoalAnalyticsResponse
)
def get_goal_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    total_goals = len(goals)

    completed_goals = sum(
        1 for goal in goals
        if goal.status == "COMPLETED"
    )

    active_goals = sum(
        1 for goal in goals
        if goal.status == "ACTIVE"
    )

    achievement_percentage = (
        round((completed_goals / total_goals) * 100, 2)
        if total_goals > 0 else 0
    )

    return {
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "active_goals": active_goals,
        "achievement_percentage": achievement_percentage
    }