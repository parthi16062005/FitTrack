from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models import Exercise, User
from schemas import (
    ExerciseCreate,
    ExerciseUpdate,
    ExerciseResponse
)
from auth import get_current_user


router = APIRouter(
    prefix="/exercises",
    tags=["Exercise Library"]
)


# ==========================================
# MODULE 8 - CREATE EXERCISE
# ==========================================

@router.post(
    "/",
    response_model=ExerciseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_exercise(
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = Exercise(
        exercise_name=exercise_data.exercise_name,
        category=exercise_data.category,
        muscle_group=exercise_data.muscle_group,
        equipment=exercise_data.equipment,
        difficulty=exercise_data.difficulty,
        description=exercise_data.description,
        instructions=exercise_data.instructions,
        image_url=exercise_data.image_url
    )

    try:
        db.add(exercise)
        db.commit()
        db.refresh(exercise)

        return exercise

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create exercise"
        )


# ==========================================
# GET ALL EXERCISES WITH SEARCH AND FILTERS
# ==========================================

@router.get(
    "/",
    response_model=list[ExerciseResponse]
)
def get_exercises(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    muscle_group: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Exercise)

    if search:
        query = query.filter(
            Exercise.exercise_name.ilike(f"%{search.strip()}%")
        )

    if category:
        query = query.filter(
            Exercise.category.ilike(category.strip())
        )

    if muscle_group:
        query = query.filter(
            Exercise.muscle_group.ilike(muscle_group.strip())
        )

    if difficulty:
        query = query.filter(
            Exercise.difficulty.ilike(difficulty.strip())
        )

    return query.order_by(Exercise.exercise_name.asc()).all()


# ==========================================
# GET EXERCISE BY ID
# ==========================================

@router.get(
    "/{exercise_id}",
    response_model=ExerciseResponse
)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    return exercise


# ==========================================
# UPDATE EXERCISE
# ==========================================

@router.put(
    "/{exercise_id}",
    response_model=ExerciseResponse
)
def update_exercise(
    exercise_id: int,
    exercise_data: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    update_data = exercise_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(exercise, key, value)

    try:
        db.commit()
        db.refresh(exercise)

        return exercise

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update exercise"
        )


# ==========================================
# DELETE EXERCISE
# ==========================================

@router.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    try:
        db.delete(exercise)
        db.commit()

        return {
            "message": "Exercise deleted successfully"
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete exercise"
        )