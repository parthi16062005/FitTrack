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


# =====================================
# MODULE 7 - WORKOUT PLAN MODEL
# =====================================

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

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

    description = Column(
        Text,
        nullable=True
    )

    scheduled_date = Column(
        Date,
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )


# =====================================
# MODULE 8 - EXERCISE LIBRARY MODEL
# =====================================

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    exercise_name = Column(
        String(150),
        nullable=False,
        index=True
    )

    category = Column(
        String(50),
        nullable=False,
        index=True
    )

    muscle_group = Column(
        String(100),
        nullable=False,
        index=True
    )

    equipment = Column(
        String(100),
        nullable=False
    )

    difficulty = Column(
        String(30),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    instructions = Column(
        Text,
        nullable=False
    )

    image_url = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )

# ==========================================
# MODULE 9 - PROGRESS COMPARISON MODEL
# ==========================================

class ProgressComparison(Base):

    __tablename__ = "progress_comparisons"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    comparison_type = Column(
        String(30),
        nullable=False
    )

    period_start = Column(
        Date,
        nullable=False
    )

    period_end = Column(
        Date,
        nullable=False
    )

    total_workouts = Column(
        Integer,
        default=0,
        nullable=False
    )

    total_duration = Column(
        Integer,
        default=0,
        nullable=False
    )

    total_calories = Column(
        Integer,
        default=0,
        nullable=False
    )

    average_weight = Column(
        Float,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )    

# ==========================================
# MODULE 10 - WORKOUT STREAK MODEL
# ==========================================

class WorkoutStreak(Base):

    __tablename__ = "workout_streaks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True
    )

    current_streak = Column(
        Integer,
        default=0,
        nullable=False
    )

    longest_streak = Column(
        Integer,
        default=0,
        nullable=False
    )

    total_active_days = Column(
        Integer,
        default=0,
        nullable=False
    )

    last_workout_date = Column(
        Date,
        nullable=True
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=current_time,
        onupdate=current_time,
        nullable=False
    )    

# ==========================================
# MODULE 11 - ACHIEVEMENT BADGE MODEL
# ==========================================

class AchievementBadge(Base):

    __tablename__ = "achievement_badges"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    badge_code = Column(
        String(50),
        nullable=False,
        index=True
    )

    badge_name = Column(
        String(100),
        nullable=False
    )

    description = Column(
        String(255),
        nullable=False
    )

    icon = Column(
        String(100),
        nullable=False
    )

    earned_at = Column(
        DateTime(timezone=True),
        default=current_time,
        nullable=False
    )    