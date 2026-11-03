from datetime import date, datetime
from typing import List

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


# =====================================
# MODULE 1 - AUTHENTICATION SCHEMAS
# =====================================

class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# =====================================
# MODULE 2 - WORKOUT SCHEMAS
# =====================================

class WorkoutCreate(BaseModel):
    workout_name: str = Field(min_length=2, max_length=100)
    category: str
    duration: int = Field(gt=0, le=1440)
    calories_burned: int = Field(ge=0, le=10000)
    workout_date: date
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value):
        allowed_categories = ["Cardio", "Strength", "Yoga"]

        if value not in allowed_categories:
            raise ValueError(
                "Category must be Cardio, Strength or Yoga"
            )

        return value

    @field_validator("workout_name")
    @classmethod
    def validate_workout_name(cls, value):
        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Workout name must contain at least 2 characters"
            )

        return value


class WorkoutUpdate(WorkoutCreate):
    pass


class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    workout_name: str
    category: str
    duration: int
    calories_burned: int
    workout_date: date
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# MODULE 3 - DAILY PROGRESS SCHEMAS
# ==========================================

class ProgressResponse(BaseModel):
    id: int
    user_id: int
    progress_date: date
    total_workouts: int
    total_duration: int
    total_calories: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# MODULE 4 - GOAL SCHEMAS
# ==========================================

class GoalCreate(BaseModel):
    goal_type: str
    target_value: float = Field(gt=0)
    current_value: float = Field(default=0, ge=0)
    unit: str
    deadline: date

    @field_validator("goal_type")
    @classmethod
    def validate_goal_type(cls, value):
        allowed_types = [
            "Weight Loss",
            "Muscle Gain",
            "Steps"
        ]

        if value not in allowed_types:
            raise ValueError("Invalid goal type")

        return value

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, value):
        allowed_units = ["kg", "steps"]

        if value not in allowed_units:
            raise ValueError("Unit must be kg or steps")

        return value


class GoalUpdate(BaseModel):
    target_value: float | None = Field(default=None, gt=0)
    current_value: float | None = Field(default=None, ge=0)
    deadline: date | None = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_value: float
    current_value: float
    unit: str
    deadline: date
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# MODULE 5 - REPORTS & ANALYTICS SCHEMAS
# ==========================================

class DailyAnalyticsResponse(BaseModel):
    date: date
    workouts: int
    calories: int
    duration: int


class WorkoutAnalyticsResponse(BaseModel):
    start_date: date
    end_date: date
    total_workouts: int
    total_calories: int
    total_duration: int
    daily_breakdown: List[DailyAnalyticsResponse]


class GoalAnalyticsResponse(BaseModel):
    total_goals: int
    completed_goals: int
    active_goals: int
    achievement_percentage: float


# ==========================================
# MODULE 6 - NOTIFICATION SCHEMAS
# ==========================================

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)