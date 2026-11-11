from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import (
    AchievementBadge,
    Workout,
    WorkoutStreak,
    Goal,
    User
)
from schemas import AchievementBadgeResponse
from auth import get_current_user


router = APIRouter(
    prefix="/achievements",
    tags=["Achievement Badges"]
)


# ==========================================
# AVAILABLE ACHIEVEMENT BADGES
# ==========================================

BADGES = [
    {
        "badge_code": "FIRST_WORKOUT",
        "badge_name": "First Workout",
        "description": "Complete your first workout.",
        "icon": "🏅"
    },
    {
        "badge_code": "TEN_WORKOUTS",
        "badge_name": "Fitness Beginner",
        "description": "Complete 10 workouts.",
        "icon": "🥉"
    },
    {
        "badge_code": "FIFTY_WORKOUTS",
        "badge_name": "Fitness Champion",
        "description": "Complete 50 workouts.",
        "icon": "🏆"
    },
    {
        "badge_code": "SEVEN_DAY_STREAK",
        "badge_name": "7 Day Streak",
        "description": "Maintain a 7-day workout streak.",
        "icon": "🔥"
    },
    {
        "badge_code": "THIRTY_DAY_STREAK",
        "badge_name": "30 Day Streak",
        "description": "Maintain a 30-day workout streak.",
        "icon": "💎"
    },
    {
        "badge_code": "GOAL_ACHIEVER",
        "badge_name": "Goal Achiever",
        "description": "Complete your first fitness goal.",
        "icon": "🎯"
    }
]


# ==========================================
# CHECK AND UNLOCK ACHIEVEMENTS
# ==========================================

def unlock_achievements(db, user_id):

    workout_count = (
        db.query(Workout)
        .filter(Workout.user_id == user_id)
        .count()
    )

    streak = (
        db.query(WorkoutStreak)
        .filter(WorkoutStreak.user_id == user_id)
        .first()
    )

    current_streak = streak.current_streak if streak else 0
    longest_streak = streak.longest_streak if streak else 0

    completed_goal = (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.status == "COMPLETED"
        )
        .first()
    )

    earned_codes = {
        badge.badge_code
        for badge in (
            db.query(AchievementBadge)
            .filter(AchievementBadge.user_id == user_id)
            .all()
        )
    }

    unlocked = []

    for badge in BADGES:

        code = badge["badge_code"]

        should_unlock = False

        if code == "FIRST_WORKOUT" and workout_count >= 1:
            should_unlock = True

        elif code == "TEN_WORKOUTS" and workout_count >= 10:
            should_unlock = True

        elif code == "FIFTY_WORKOUTS" and workout_count >= 50:
            should_unlock = True

        elif code == "SEVEN_DAY_STREAK" and longest_streak >= 7:
            should_unlock = True

        elif code == "THIRTY_DAY_STREAK" and longest_streak >= 30:
            should_unlock = True

        elif code == "GOAL_ACHIEVER" and completed_goal:
            should_unlock = True

        if should_unlock and code not in earned_codes:

            new_badge = AchievementBadge(
                user_id=user_id,
                badge_code=code,
                badge_name=badge["badge_name"],
                description=badge["description"],
                icon=badge["icon"]
            )

            db.add(new_badge)
            unlocked.append(new_badge)

    return unlocked


# ==========================================
# GET USER ACHIEVEMENTS
# ==========================================

@router.get("/", response_model=list[AchievementBadgeResponse])
def get_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    unlock_achievements(db, current_user.id)

    db.commit()

    return (
        db.query(AchievementBadge)
        .filter(AchievementBadge.user_id == current_user.id)
        .order_by(AchievementBadge.earned_at.desc())
        .all()
    )