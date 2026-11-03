from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, Workout, Notification
from schemas import WorkoutCreate, WorkoutUpdate, WorkoutResponse
from auth import get_current_user


router = APIRouter(
    prefix="/workouts",
    tags=["Workout Management"]
)


# =====================================
# CREATE WORKOUT
# =====================================

@router.post(
    "/",
    response_model=WorkoutResponse,
    status_code=status.HTTP_201_CREATED
)
def create_workout(
    data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_workout = Workout(
        user_id=current_user.id,
        workout_name=data.workout_name,
        category=data.category,
        duration=data.duration,
        calories_burned=data.calories_burned,
        workout_date=data.workout_date,
        notes=data.notes
    )

    # Create workout notification
    workout_notification = Notification(
        user_id=current_user.id,
        title="Workout Added Successfully",
        message=(
            f"Your {data.workout_name} workout has been recorded. "
            f"You burned {data.calories_burned} calories "
            f"in {data.duration} minutes."
        ),
        notification_type="WORKOUT"
    )

    try:
        db.add(new_workout)
        db.add(workout_notification)

        db.commit()
        db.refresh(new_workout)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create workout"
        )

    return new_workout


# =====================================
# GET ALL WORKOUTS
# =====================================

@router.get(
    "/",
    response_model=list[WorkoutResponse]
)
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(
        Workout.workout_date.desc(),
        Workout.id.desc()
    ).all()


# =====================================
# GET WORKOUT BY ID
# =====================================

@router.get(
    "/{workout_id}",
    response_model=WorkoutResponse
)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    return workout


# =====================================
# UPDATE WORKOUT
# =====================================

@router.put(
    "/{workout_id}",
    response_model=WorkoutResponse
)
def update_workout(
    workout_id: int,
    data: WorkoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    workout.workout_name = data.workout_name
    workout.category = data.category
    workout.duration = data.duration
    workout.calories_burned = data.calories_burned
    workout.workout_date = data.workout_date
    workout.notes = data.notes

    try:
        db.commit()
        db.refresh(workout)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to update workout"
        )

    return workout


# =====================================
# DELETE WORKOUT
# =====================================

@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    try:
        db.delete(workout)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to delete workout"
        )

    return {
        "message": "Workout deleted successfully",
        "workout_id": workout_id
    }