from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from datetime import date, datetime, time, timedelta

from sqlalchemy import func

from models import (
    Workout,
    Goal,
    User,
    Meal,
    WaterTracking,
    WorkoutSession,
    WorkoutStreak
)

from schemas import (
    WorkoutAnalyticsResponse,
    GoalAnalyticsResponse,
    AdvancedAnalyticsResponse
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

# ==========================================
# MODULE 18 - ADVANCED ANALYTICS DASHBOARD
# ==========================================

@router.get(
    "/advanced",
    response_model=AdvancedAnalyticsResponse
)
def get_advanced_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    # Last six months
    current_month = today.replace(day=1)

    start_date = (
        current_month - timedelta(days=150)
    ).replace(day=1)

    start_datetime = datetime.combine(
        start_date,
        time.min
    )

    end_datetime = datetime.combine(
        today + timedelta(days=1),
        time.min
    )

    # ======================================
    # WORKOUT SUMMARY
    # ======================================

    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= start_date,
        Workout.workout_date <= today
    ).all()

    total_workouts = len(workouts)

    total_calories = sum(
        workout.calories_burned or 0
        for workout in workouts
    )

    total_duration = sum(
        workout.duration or 0
        for workout in workouts
    )

    average_calories = (
        round(total_calories / total_workouts, 2)
        if total_workouts else 0
    )

    # ======================================
    # WORKOUT SESSION SUMMARY
    # ======================================

    sessions = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.status == "COMPLETED",
        WorkoutSession.created_at >= start_datetime,
        WorkoutSession.created_at < end_datetime
    ).all()

    total_sessions = len(sessions)

    total_session_duration = sum(
        session.duration_seconds or 0
        for session in sessions
    )

    # ======================================
    # CATEGORY BREAKDOWN
    # ======================================

    category_data = {}

    for workout in workouts:

        category = workout.category

        if category not in category_data:
            category_data[category] = {
                "category": category,
                "total_workouts": 0,
                "total_calories": 0
            }

        category_data[category]["total_workouts"] += 1

        category_data[category]["total_calories"] += (
            workout.calories_burned or 0
        )

    category_breakdown = list(
        category_data.values()
    )

    # ======================================
    # MONTHLY WORKOUT TRENDS
    # ======================================

    monthly_data = {}

    month_cursor = start_date

    for _ in range(6):

        month_key = month_cursor.strftime("%Y-%m")

        monthly_data[month_key] = {
            "month": month_cursor.strftime("%b %Y"),
            "total_workouts": 0,
            "total_calories": 0,
            "total_duration": 0
        }

        next_month = (
            month_cursor.replace(day=28)
            + timedelta(days=4)
        ).replace(day=1)

        month_cursor = next_month

    for workout in workouts:

        month_key = workout.workout_date.strftime("%Y-%m")

        if month_key in monthly_data:

            monthly_data[month_key]["total_workouts"] += 1

            monthly_data[month_key]["total_calories"] += (
                workout.calories_burned or 0
            )

            monthly_data[month_key]["total_duration"] += (
                workout.duration or 0
            )

    monthly_trends = list(
        monthly_data.values()
    )

    # ======================================
    # NUTRITION ANALYTICS
    # ======================================

    meals = db.query(Meal).filter(
        Meal.user_id == current_user.id,
        Meal.created_at >= start_datetime,
        Meal.created_at < end_datetime
    ).all()

    nutrition = {
        "total_meals": len(meals),

        "total_calories": round(
            sum(meal.calories or 0 for meal in meals), 2
        ),

        "total_protein": round(
            sum(meal.protein or 0 for meal in meals), 2
        ),

        "total_carbs": round(
            sum(meal.carbs or 0 for meal in meals), 2
        ),

        "total_fats": round(
            sum(meal.fats or 0 for meal in meals), 2
        )
    }

    # ======================================
    # WATER INTAKE ANALYTICS
    # ======================================

    water_entries = db.query(WaterTracking).filter(
        WaterTracking.user_id == current_user.id,
        WaterTracking.date >= start_date,
        WaterTracking.date <= today
    ).all()

    total_water = sum(
        entry.quantity or 0
        for entry in water_entries
    )

    active_water_days = len({
        entry.date for entry in water_entries
    })

    average_daily_water = (
        round(total_water / active_water_days, 2)
        if active_water_days else 0
    )

    water = {
        "total_water": total_water,
        "average_daily_water": average_daily_water,
        "total_entries": len(water_entries)
    }

    # ======================================
    # WORKOUT STREAK ANALYTICS
    # ======================================

    streak_record = db.query(WorkoutStreak).filter(
        WorkoutStreak.user_id == current_user.id
    ).first()

    streak = {
        "current_streak": (
            streak_record.current_streak
            if streak_record else 0
        ),

        "longest_streak": (
            streak_record.longest_streak
            if streak_record else 0
        ),

        "total_active_days": (
            streak_record.total_active_days
            if streak_record else 0
        )
    }

    # ======================================
    # GOAL ANALYTICS
    # ======================================

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
        round(
            (completed_goals / total_goals) * 100,
            2
        )
        if total_goals else 0
    )

    goal_analytics = {
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "active_goals": active_goals,
        "achievement_percentage": achievement_percentage
    }

    # ======================================
    # FINAL RESPONSE
    # ======================================

    return {
        "summary": {
            "total_workouts": total_workouts,
            "total_calories": total_calories,
            "total_duration": total_duration,
            "total_sessions": total_sessions,
            "total_session_duration": total_session_duration,
            "average_calories": average_calories
        },

        "category_breakdown": category_breakdown,

        "monthly_trends": monthly_trends,

        "nutrition": nutrition,

        "water": water,

        "streak": streak,

        "goals": goal_analytics
    }