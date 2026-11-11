from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Reminder, Notification, User
from schemas import ReminderCreate, ReminderUpdate, ReminderResponse
from auth import get_current_user


router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)


# ==========================================
# PROCESS DUE REMINDERS
# ==========================================

def process_due_reminders(db: Session, user_id: int):

    now = datetime.now(timezone.utc)

    reminders = db.query(Reminder).filter(
        Reminder.user_id == user_id,
        Reminder.is_active == True,
        Reminder.is_completed == False,
        Reminder.reminder_time <= now
    ).all()

    for reminder in reminders:

        notification = Notification(
            user_id=user_id,
            title=reminder.title,
            message=(
                reminder.description
                or f"It's time for your {reminder.reminder_type.lower()} reminder."
            ),
            notification_type="REMINDER"
        )

        db.add(notification)

        # Prevent duplicate notifications
        reminder.is_active = False

    if reminders:
        db.commit()


# ==========================================
# CREATE REMINDER
# ==========================================

@router.post("/", response_model=ReminderResponse)
def create_reminder(
    reminder_data: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if reminder_data.reminder_time <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Reminder time must be in the future"
        )

    reminder = Reminder(
        user_id=current_user.id,
        title=reminder_data.title,
        description=reminder_data.description,
        reminder_type=reminder_data.reminder_type,
        reminder_time=reminder_data.reminder_time
    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return reminder


# ==========================================
# GET ALL REMINDERS
# ==========================================

@router.get("/", response_model=list[ReminderResponse])
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    process_due_reminders(db, current_user.id)

    return db.query(Reminder).filter(
        Reminder.user_id == current_user.id
    ).order_by(
        Reminder.reminder_time.asc()
    ).all()


# ==========================================
# GET UPCOMING REMINDERS
# ==========================================

@router.get("/upcoming", response_model=list[ReminderResponse])
def get_upcoming_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    process_due_reminders(db, current_user.id)

    return db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.is_active == True,
        Reminder.is_completed == False
    ).order_by(
        Reminder.reminder_time.asc()
    ).all()


# ==========================================
# UPDATE REMINDER
# ==========================================

@router.patch("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    reminder_data: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    update_data = reminder_data.model_dump(exclude_unset=True)

    if (
        "reminder_time" in update_data
        and update_data["reminder_time"] is not None
        and update_data["reminder_time"] <= datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400,
            detail="Reminder time must be in the future"
        )

    for field, value in update_data.items():
        setattr(reminder, field, value)

    db.commit()
    db.refresh(reminder)

    return reminder


# ==========================================
# COMPLETE REMINDER
# ==========================================

@router.patch("/{reminder_id}/complete")
def complete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    reminder.is_completed = True
    reminder.is_active = False

    db.commit()

    return {
        "message": "Reminder completed successfully"
    }


# ==========================================
# DELETE REMINDER
# ==========================================

@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.delete(reminder)
    db.commit()

    return {
        "message": "Reminder deleted successfully"
    }