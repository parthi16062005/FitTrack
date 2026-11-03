from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Float,
    Boolean
)

from database import Base


def current_time():
    return datetime.now(timezone.utc)


# =====================================
# USER MODEL
# =====================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False, index=True)

    email = Column(String(255), unique=True, nullable=False, index=True)

    hashed_password = Column(String(255), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )


# =====================================
# WORKOUT MODEL
# =====================================

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    workout_name = Column(String(100), nullable=False)

    category = Column(String(30), nullable=False)

    duration = Column(Integer, nullable=False)

    calories_burned = Column(Integer, nullable=False)

    workout_date = Column(Date, nullable=False, index=True)

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )


# =====================================
# DAILY PROGRESS MODEL
# =====================================

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    progress_date = Column(Date, nullable=False, index=True)

    total_workouts = Column(Integer, default=0, nullable=False)

    total_duration = Column(Integer, default=0, nullable=False)

    total_calories = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime,
        default=current_time
    )


# =====================================
# GOAL MODEL
# =====================================

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    goal_type = Column(String, nullable=False)

    target_value = Column(Float, nullable=False)

    current_value = Column(Float, default=0.0, nullable=False)

    unit = Column(String, nullable=False)

    deadline = Column(Date, nullable=False)

    status = Column(String, default="ACTIVE", nullable=False)

    created_at = Column(
        DateTime,
        default=current_time
    )


# =====================================
# NOTIFICATION MODEL
# =====================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = Column(
        String(150),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    notification_type = Column(
        String(50),
        default="GENERAL",
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )