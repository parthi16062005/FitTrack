from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Goal, User, Notification
from schemas import GoalCreate, GoalUpdate, GoalResponse
from auth import get_current_user


router = APIRouter(
    prefix="/goals",
    tags=["Goal Management"]
)


# ==========================================
# CREATE GOAL
# ==========================================

@router.post("/", response_model=GoalResponse)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if goal_data.goal_type in ["Weight Loss", "Muscle Gain"]:
        if goal_data.unit != "kg":
            raise HTTPException(
                status_code=400,
                detail="Weight goals must use kg"
            )

    if goal_data.goal_type == "Steps":
        if goal_data.unit != "steps":
            raise HTTPException(
                status_code=400,
                detail="Steps goal must use steps"
            )

    if goal_data.current_value >= goal_data.target_value:
        status_value = "COMPLETED"
    else:
        status_value = "ACTIVE"

    new_goal = Goal(
        user_id=current_user.id,
        goal_type=goal_data.goal_type,
        target_value=goal_data.target_value,
        current_value=goal_data.current_value,
        unit=goal_data.unit,
        deadline=goal_data.deadline,
        status=status_value
    )

    goal_notification = Notification(
        user_id=current_user.id,
        title="New Fitness Goal Created",
        message=(
            f"Your {goal_data.goal_type} goal has been created. "
            f"Your target is {goal_data.target_value} "
            f"{goal_data.unit}."
        ),
        notification_type="GOAL"
    )

    try:
        db.add(new_goal)
        db.add(goal_notification)

        # If the goal was created already completed
        if status_value == "COMPLETED":

            completion_notification = Notification(
                user_id=current_user.id,
                title="Goal Completed!",
                message=(
                    f"Congratulations! You have completed "
                    f"your {goal_data.goal_type} goal."
                ),
                notification_type="GOAL"
            )

            db.add(completion_notification)

        db.commit()
        db.refresh(new_goal)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create goal"
        )

    return new_goal


# ==========================================
# GET MY GOALS
# ==========================================

@router.get("/", response_model=list[GoalResponse])
def get_my_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).order_by(Goal.created_at.desc()).all()

    return goals


# ==========================================
# GET SINGLE GOAL
# ==========================================

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return goal


# ==========================================
# UPDATE GOAL
# ==========================================

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    previous_status = goal.status

    update_data = goal_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(goal, field, value)

    if goal.current_value >= goal.target_value:
        goal.status = "COMPLETED"
    else:
        goal.status = "ACTIVE"

    try:

        # Notify only when goal changes from ACTIVE to COMPLETED
        if (
            previous_status != "COMPLETED"
            and goal.status == "COMPLETED"
        ):

            completion_notification = Notification(
                user_id=current_user.id,
                title="Goal Completed!",
                message=(
                    f"Congratulations! You have completed "
                    f"your {goal.goal_type} goal."
                ),
                notification_type="GOAL"
            )

            db.add(completion_notification)

        db.commit()
        db.refresh(goal)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to update goal"
        )

    return goal


# ==========================================
# DELETE GOAL
# ==========================================

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    try:
        db.delete(goal)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to delete goal"
        )

    return {
        "message": "Goal deleted successfully"
    }