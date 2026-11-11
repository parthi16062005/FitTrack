from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Workout, WorkoutStreak, User
from schemas import WorkoutStreakResponse
from auth import get_current_user


router = APIRouter(
    prefix="/streaks",
    tags=["Workout Streak Tracking"]
)


# ==========================================
# CALCULATE WORKOUT STREAK
# ==========================================

def calculate_streak(workout_dates):

    today = date.today()

    # Remove duplicate dates and future dates
    dates = sorted({
        workout_date
        for workout_date in workout_dates
        if workout_date and workout_date <= today
    })

    if not dates:
        return 0, 0, 0, None

    # Calculate longest streak
    longest_streak = 1
    current_count = 1

    for index in range(1, len(dates)):

        difference = (dates[index] - dates[index - 1]).days

        if difference == 1:
            current_count += 1
        else:
            current_count = 1

        longest_streak = max(longest_streak, current_count)

    # Calculate current streak
    current_streak = 0
    latest_date = dates[-1]

    if latest_date >= today - timedelta(days=1):

        current_streak = 1
        check_date = latest_date - timedelta(days=1)

        for workout_date in reversed(dates[:-1]):

            if workout_date == check_date:
                current_streak += 1
                check_date -= timedelta(days=1)

            elif workout_date < check_date:
                break

    return (
        current_streak,
        longest_streak,
        len(dates),
        latest_date
    )


# ==========================================
# GET USER WORKOUT STREAK
# ==========================================

@router.get("/", response_model=WorkoutStreakResponse)
def get_workout_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    workout_dates = (
        db.query(Workout.workout_date)
        .filter(Workout.user_id == current_user.id)
        .all()
    )

    dates = [record[0] for record in workout_dates]

    current, longest, total, latest = calculate_streak(dates)

    streak = (
        db.query(WorkoutStreak)
        .filter(WorkoutStreak.user_id == current_user.id)
        .first()
    )

    if not streak:

        streak = WorkoutStreak(
            user_id=current_user.id,
            current_streak=current,
            longest_streak=longest,
            total_active_days=total,
            last_workout_date=latest
        )

        db.add(streak)

    else:

        streak.current_streak = current
        streak.longest_streak = longest
        streak.total_active_days = total
        streak.last_workout_date = latest

    db.commit()
    db.refresh(streak)

    return streak