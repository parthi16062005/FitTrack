from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import WorkoutPlan
from schemas import (
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    WorkoutPlanResponse
)
from auth import get_current_user


router = APIRouter(
    prefix="/workout-plans",
    tags=["Workout Plans & Scheduling"]
)


# ==========================================
# CREATE WORKOUT PLAN
# ==========================================

@router.post(
    "/",
    response_model=WorkoutPlanResponse,
    status_code=status.HTTP_201_CREATED
)
def create_workout_plan(
    data: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if data.scheduled_date < date.today():
        raise HTTPException(
            status_code=400,
            detail="Workout plan date cannot be in the past"
        )

    new_plan = WorkoutPlan(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        scheduled_date=data.scheduled_date
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return new_plan


# ==========================================
# VIEW ALL WORKOUT PLANS
# ==========================================

@router.get(
    "/",
    response_model=list[WorkoutPlanResponse]
)
def get_workout_plans(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    plans = (
        db.query(WorkoutPlan)
        .filter(WorkoutPlan.user_id == current_user.id)
        .order_by(WorkoutPlan.scheduled_date.asc())
        .all()
    )

    return plans


# ==========================================
# VIEW UPCOMING WORKOUT PLANS
# ==========================================

@router.get(
    "/upcoming",
    response_model=list[WorkoutPlanResponse]
)
def get_upcoming_workout_plans(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    plans = (
        db.query(WorkoutPlan)
        .filter(
            WorkoutPlan.user_id == current_user.id,
            WorkoutPlan.scheduled_date >= date.today()
        )
        .order_by(WorkoutPlan.scheduled_date.asc())
        .all()
    )

    return plans


# ==========================================
# UPDATE WORKOUT PLAN
# ==========================================

@router.put(
    "/{plan_id}",
    response_model=WorkoutPlanResponse
)
def update_workout_plan(
    plan_id: int,
    data: WorkoutPlanUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    plan = (
        db.query(WorkoutPlan)
        .filter(
            WorkoutPlan.id == plan_id,
            WorkoutPlan.user_id == current_user.id
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Workout plan not found"
        )

    update_data = data.model_dump(exclude_unset=True)

    if (
        "scheduled_date" in update_data
        and update_data["scheduled_date"] is not None
        and update_data["scheduled_date"] < date.today()
    ):
        raise HTTPException(
            status_code=400,
            detail="Workout plan date cannot be in the past"
        )

    for key, value in update_data.items():
        setattr(plan, key, value)

    db.commit()
    db.refresh(plan)

    return plan


# ==========================================
# DELETE WORKOUT PLAN
# ==========================================

@router.delete("/{plan_id}")
def delete_workout_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    plan = (
        db.query(WorkoutPlan)
        .filter(
            WorkoutPlan.id == plan_id,
            WorkoutPlan.user_id == current_user.id
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Workout plan not found"
        )

    db.delete(plan)
    db.commit()

    return {
        "message": "Workout plan deleted successfully"
    }