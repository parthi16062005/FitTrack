from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import WaterTracking
from schemas import (
    WaterTrackingCreate,
    WaterTrackingResponse,
    WaterTrackingSummary
)
from auth import get_current_user


router = APIRouter(
    prefix="/water",
    tags=["Water Intake Tracking"]
)

# Default daily water goal: 2500 ml
DAILY_WATER_GOAL = 2500


# ==========================================
# LOG WATER INTAKE
# ==========================================

@router.post("/log", response_model=WaterTrackingResponse)
def log_water(
    water_data: WaterTrackingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    water = WaterTracking(
        user_id=current_user.id,
        quantity=water_data.quantity,
        date=date.today()
    )

    db.add(water)
    db.commit()
    db.refresh(water)

    return water


# ==========================================
# GET WATER HISTORY
# ==========================================

@router.get("/history", response_model=list[WaterTrackingResponse])
def get_water_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return (
        db.query(WaterTracking)
        .filter(WaterTracking.user_id == current_user.id)
        .order_by(WaterTracking.id.desc())
        .all()
    )


# ==========================================
# DAILY WATER SUMMARY
# ==========================================

@router.get("/summary", response_model=WaterTrackingSummary)
def get_water_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    today = date.today()

    result = db.query(
        func.coalesce(func.sum(WaterTracking.quantity), 0),
        func.count(WaterTracking.id)
    ).filter(
        WaterTracking.user_id == current_user.id,
        WaterTracking.date == today
    ).first()

    total_water = int(result[0])
    total_entries = result[1]

    remaining_water = max(
        DAILY_WATER_GOAL - total_water,
        0
    )

    completion_percentage = round(
        min((total_water / DAILY_WATER_GOAL) * 100, 100),
        2
    )

    return WaterTrackingSummary(
        total_water=total_water,
        daily_goal=DAILY_WATER_GOAL,
        remaining_water=remaining_water,
        completion_percentage=completion_percentage,
        total_entries=total_entries
    )


# ==========================================
# DELETE WATER ENTRY
# ==========================================

@router.delete("/log/{entry_id}")
def delete_water_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    entry = db.query(WaterTracking).filter(
        WaterTracking.id == entry_id,
        WaterTracking.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Water entry not found"
        )

    db.delete(entry)
    db.commit()

    return {
        "message": "Water entry deleted successfully"
    }