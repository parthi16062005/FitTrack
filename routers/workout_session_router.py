from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user

from models import WorkoutSession

from schemas import (
    WorkoutSessionCreate,
    WorkoutSessionResponse
)


router = APIRouter(
    prefix="/workout-sessions",
    tags=["Workout Timer & Live Tracking"]
)


# ==========================================
# HELPER - CURRENT UTC TIME
# ==========================================

def get_current_time():
    return datetime.now(timezone.utc)


def get_elapsed_seconds(start_time, end_time):

    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)

    if end_time.tzinfo is None:
        end_time = end_time.replace(tzinfo=timezone.utc)

    return max(
        0,
        int((end_time - start_time).total_seconds())
    )


# ==========================================
# START WORKOUT SESSION
# ==========================================

@router.post(
    "/start",
    response_model=WorkoutSessionResponse
)
def start_workout(
    data: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    active_session = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.status.in_(["ACTIVE", "PAUSED"])
    ).first()

    if active_session:

        raise HTTPException(
            status_code=400,
            detail="You already have an active workout session."
        )

    session = WorkoutSession(
        user_id=current_user.id,
        workout_name=data.workout_name,
        category=data.category,
        status="ACTIVE",
        start_time=get_current_time()
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


# ==========================================
# PAUSE WORKOUT SESSION
# ==========================================

@router.post(
    "/{session_id}/pause",
    response_model=WorkoutSessionResponse
)
def pause_workout(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    session = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        WorkoutSession.user_id == current_user.id
    ).first()

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Workout session not found."
        )

    if session.status != "ACTIVE":

        raise HTTPException(
            status_code=400,
            detail="Only active workouts can be paused."
        )

    session.status = "PAUSED"
    session.paused_at = get_current_time()

    db.commit()
    db.refresh(session)

    return session


# ==========================================
# RESUME WORKOUT SESSION
# ==========================================

@router.post(
    "/{session_id}/resume",
    response_model=WorkoutSessionResponse
)
def resume_workout(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    session = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        WorkoutSession.user_id == current_user.id
    ).first()

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Workout session not found."
        )

    if session.status != "PAUSED" or not session.paused_at:

        raise HTTPException(
            status_code=400,
            detail="Only paused workouts can be resumed."
        )

    pause_seconds = get_elapsed_seconds(
        session.paused_at,
        get_current_time()
    )

    session.paused_duration_seconds += pause_seconds

    session.paused_at = None
    session.status = "ACTIVE"

    db.commit()
    db.refresh(session)

    return session


# ==========================================
# STOP WORKOUT SESSION
# ==========================================

@router.post(
    "/{session_id}/stop",
    response_model=WorkoutSessionResponse
)
def stop_workout(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    session = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        WorkoutSession.user_id == current_user.id
    ).first()

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Workout session not found."
        )

    if session.status not in ["ACTIVE", "PAUSED"]:

        raise HTTPException(
            status_code=400,
            detail="Workout session is already completed."
        )

    end_time = get_current_time()

    total_elapsed = get_elapsed_seconds(
        session.start_time,
        end_time
    )

    # Include the final pause if the session is paused.
    if session.status == "PAUSED" and session.paused_at:

        session.paused_duration_seconds += get_elapsed_seconds(
            session.paused_at,
            end_time
        )

        session.paused_at = None

    session.duration_seconds = max(
        0,
        total_elapsed - session.paused_duration_seconds
    )

    session.end_time = end_time
    session.status = "COMPLETED"

    # Basic estimated calorie calculation.
    session.calories_burned = max(
        0,
        round((session.duration_seconds / 60) * 5)
    )

    db.commit()
    db.refresh(session)

    return session


# ==========================================
# GET ACTIVE WORKOUT SESSION
# ==========================================

@router.get(
    "/active",
    response_model=WorkoutSessionResponse
)
def get_active_workout(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    session = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.status.in_(["ACTIVE", "PAUSED"])
    ).first()

    if not session:

        raise HTTPException(
            status_code=404,
            detail="No active workout session found."
        )

    return session


# ==========================================
# GET WORKOUT SESSION HISTORY
# ==========================================

@router.get(
    "/history",
    response_model=list[WorkoutSessionResponse]
)
def get_workout_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    sessions = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id
    ).order_by(
        WorkoutSession.created_at.desc()
    ).all()

    return sessions