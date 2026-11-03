from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Progress, Workout, User
from schemas import ProgressResponse
from auth import get_current_user


router = APIRouter(
    prefix="/progress",
    tags=["Daily Progress Tracking"]
)


# ==========================================
# GET DAILY PROGRESS
# ==========================================

@router.get("/", response_model=ProgressResponse)
def get_daily_progress(
    progress_date: date = date.today(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date == progress_date
    ).all()

    total_workouts = len(workouts)

    total_duration = sum(
        workout.duration for workout in workouts
    )

    total_calories = sum(
        workout.calories_burned for workout in workouts
    )

    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.progress_date == progress_date
    ).first()

    if progress is None:

        progress = Progress(
            user_id=current_user.id,
            progress_date=progress_date,
            total_workouts=total_workouts,
            total_duration=total_duration,
            total_calories=total_calories
        )

        db.add(progress)

    else:

        progress.total_workouts = total_workouts
        progress.total_duration = total_duration
        progress.total_calories = total_calories

    db.commit()
    db.refresh(progress)

    return progress