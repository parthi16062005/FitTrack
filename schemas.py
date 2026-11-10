from datetime import date, datetime
from typing import List, Optional

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


# ==========================================
# MODULE 7 - WORKOUT PLAN SCHEMAS
# ==========================================

class WorkoutPlanCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)

    description: str | None = Field(
        default=None,
        max_length=1000
    )

    scheduled_date: date

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if len(value) < 3:
            raise ValueError(
                "Workout plan title must contain at least 3 characters"
            )

        return value


class WorkoutPlanUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=150
    )

    description: str | None = Field(
        default=None,
        max_length=1000
    )

    scheduled_date: date | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if value is not None:
            value = value.strip()

            if len(value) < 3:
                raise ValueError(
                    "Workout plan title must contain at least 3 characters"
                )

        return value


class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    scheduled_date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# MODULE 8 - EXERCISE LIBRARY SCHEMAS
# ==========================================

class ExerciseCreate(BaseModel):
    exercise_name: str = Field(
        min_length=2,
        max_length=150
    )

    category: str = Field(
        min_length=2,
        max_length=50
    )

    muscle_group: str = Field(
        min_length=2,
        max_length=100
    )

    equipment: str = Field(
        min_length=2,
        max_length=100
    )

    difficulty: str

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    instructions: str = Field(
        min_length=5
    )

    image_url: str | None = Field(
        default=None,
        max_length=500
    )

    @field_validator(
        "exercise_name",
        "category",
        "muscle_group",
        "equipment",
        "instructions"
    )
    @classmethod
    def validate_required_text(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty")

        return value

    @field_validator("difficulty")
    @classmethod
    def validate_difficulty(cls, value):
        allowed_levels = [
            "Beginner",
            "Intermediate",
            "Advanced"
        ]

        value = value.strip().title()

        if value not in allowed_levels:
            raise ValueError(
                "Difficulty must be Beginner, Intermediate or Advanced"
            )

        return value


class ExerciseUpdate(BaseModel):
    exercise_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    muscle_group: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    equipment: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    difficulty: str | None = None

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    instructions: str | None = Field(
        default=None,
        min_length=5
    )

    image_url: str | None = Field(
        default=None,
        max_length=500
    )

    @field_validator(
        "exercise_name",
        "category",
        "muscle_group",
        "equipment",
        "instructions"
    )
    @classmethod
    def validate_optional_text(cls, value):
        if value is not None:
            value = value.strip()

            if not value:
                raise ValueError("This field cannot be empty")

        return value

    @field_validator("difficulty")
    @classmethod
    def validate_optional_difficulty(cls, value):
        if value is not None:
            allowed_levels = [
                "Beginner",
                "Intermediate",
                "Advanced"
            ]

            value = value.strip().title()

            if value not in allowed_levels:
                raise ValueError(
                    "Difficulty must be Beginner, Intermediate or Advanced"
                )

        return value


class ExerciseResponse(BaseModel):
    id: int
    exercise_name: str
    category: str
    muscle_group: str
    equipment: str
    difficulty: str
    description: str | None
    instructions: str
    image_url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ==========================================
# MODULE 9 - PROGRESS COMPARISON SCHEMAS
# ==========================================

class ProgressComparisonResponse(BaseModel):

    id: int
    user_id: int

    comparison_type: str

    period_start: date
    period_end: date

    total_workouts: int
    total_duration: int
    total_calories: int

    average_weight: Optional[float] = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgressComparisonResult(BaseModel):

    current_period: ProgressComparisonResponse
    previous_period: ProgressComparisonResponse

    workout_change: float
    duration_change: float
    calories_change: float
    weight_change: Optional[float] = None

# ==========================================
# MODULE 10 - WORKOUT STREAK SCHEMAS
# ==========================================

class WorkoutStreakResponse(BaseModel):

    id: int
    user_id: int

    current_streak: int
    longest_streak: int
    total_active_days: int

    last_workout_date: Optional[date] = None

    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ==========================================
# MODULE 11 - ACHIEVEMENT BADGE SCHEMAS
# ==========================================

class AchievementBadgeResponse(BaseModel):

    id: int
    user_id: int
    badge_code: str
    badge_name: str
    description: str
    icon: str
    earned_at: datetime

    model_config = ConfigDict(from_attributes=True)
