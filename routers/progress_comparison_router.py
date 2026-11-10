from datetime import date, timedelta
import calendar

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Progress, ProgressComparison, User
from schemas import (
    ProgressComparisonResponse,
    ProgressComparisonResult
)
from auth import get_current_user


router = APIRouter(
    prefix="/progress-comparison",
    tags=["Progress Comparison"]
)


# ==========================================
# HELPER - CREATE COMPARISON SNAPSHOT
# ==========================================

def create_snapshot(
    db: Session,
    user_id: int,
    comparison_type: str,
    start_date: date,
    end_date: date
):

    records = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.progress_date >= start_date,
        Progress.progress_date <= end_date
    ).all()

    total_workouts = sum(
        record.total_workouts for record in records
    )

    total_duration = sum(
        record.total_duration for record in records
    )

    total_calories = sum(
        record.total_calories for record in records
    )

    snapshot = db.query(ProgressComparison).filter(
        ProgressComparison.user_id == user_id,
        ProgressComparison.comparison_type == comparison_type,
        ProgressComparison.period_start == start_date,
        ProgressComparison.period_end == end_date
    ).first()

    if snapshot:

        snapshot.total_workouts = total_workouts
        snapshot.total_duration = total_duration
        snapshot.total_calories = total_calories

    else:

        snapshot = ProgressComparison(
            user_id=user_id,
            comparison_type=comparison_type,
            period_start=start_date,
            period_end=end_date,
            total_workouts=total_workouts,
            total_duration=total_duration,
            total_calories=total_calories,
            average_weight=None
        )

        db.add(snapshot)

    db.flush()

    return snapshot


# ==========================================
# HELPER - CALCULATE PERCENTAGE CHANGE
# ==========================================

def calculate_change(current, previous):

    if previous == 0:

        return 100.0 if current > 0 else 0.0

    return round(
        ((current - previous) / previous) * 100,
        2
    )


# ==========================================
# HELPER - BUILD COMPARISON RESULT
# ==========================================

def build_comparison(
    db: Session,
    user_id: int,
    comparison_type: str,
    current_start: date,
    current_end: date,
    previous_start: date,
    previous_end: date
):

    current = create_snapshot(
        db,
        user_id,
        comparison_type,
        current_start,
        current_end
    )

    previous = create_snapshot(
        db,
        user_id,
        comparison_type,
        previous_start,
        previous_end
    )

    db.commit()

    db.refresh(current)
    db.refresh(previous)

    return ProgressComparisonResult(
        current_period=current,
        previous_period=previous,

        workout_change=calculate_change(
            current.total_workouts,
            previous.total_workouts
        ),

        duration_change=calculate_change(
            current.total_duration,
            previous.total_duration
        ),

        calories_change=calculate_change(
            current.total_calories,
            previous.total_calories
        ),

        weight_change=None
    )


# ==========================================
# WEEKLY PROGRESS COMPARISON
# ==========================================

@router.get(
    "/weekly",
    response_model=ProgressComparisonResult
)
def weekly_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    current_start = today - timedelta(
        days=today.weekday()
    )

    current_end = today

    previous_start = current_start - timedelta(days=7)

    previous_end = current_end - timedelta(days=7)

    return build_comparison(
        db,
        current_user.id,
        "WEEKLY",
        current_start,
        current_end,
        previous_start,
        previous_end
    )


# ==========================================
# MONTHLY PROGRESS COMPARISON
# ==========================================

@router.get(
    "/monthly",
    response_model=ProgressComparisonResult
)
def monthly_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    current_start = today.replace(day=1)

    current_end = today

    if today.month == 1:

        previous_year = today.year - 1
        previous_month = 12

    else:

        previous_year = today.year
        previous_month = today.month - 1

    previous_start = date(
        previous_year,
        previous_month,
        1
    )

    previous_month_days = calendar.monthrange(
        previous_year,
        previous_month
    )[1]

    previous_end = date(
        previous_year,
        previous_month,
        min(today.day, previous_month_days)
    )

    return build_comparison(
        db,
        current_user.id,
        "MONTHLY",
        current_start,
        current_end,
        previous_start,
        previous_end
    )