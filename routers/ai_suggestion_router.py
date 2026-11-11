from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user

from models import (
    Workout,
    Goal,
    Exercise,
    WorkoutStreak
)

from schemas import (
    WorkoutSuggestionResponse,
    SuggestedExercise
)


router = APIRouter(
    prefix="/ai-suggestions",
    tags=["AI Workout Suggestions"]
)


# ==========================================
# MODULE 15 - AI WORKOUT SUGGESTIONS
# ==========================================

@router.get(
    "/",
    response_model=WorkoutSuggestionResponse
)
def get_workout_suggestions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    today = date.today()

    # --------------------------------------
    # GET USER WORKOUT HISTORY
    # --------------------------------------

    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(
        Workout.workout_date.desc()
    ).limit(10).all()

    recent_categories = [
        workout.category.lower()
        for workout in workouts
    ]

    # --------------------------------------
    # GET USER FITNESS GOALS
    # --------------------------------------

    goal = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.status == "ACTIVE"
    ).order_by(
        Goal.deadline.asc()
    ).first()

    # --------------------------------------
    # GET WORKOUT STREAK
    # --------------------------------------

    streak = db.query(WorkoutStreak).filter(
        WorkoutStreak.user_id == current_user.id
    ).first()

    current_streak = (
        streak.current_streak if streak else 0
    )

    # --------------------------------------
    # ANALYZE FITNESS FOCUS
    # --------------------------------------

    fitness_focus = "General Fitness"
    recommendation = "Full Body Workout"
    difficulty_level = "Beginner"
    suggested_duration = 30

    reason = (
        "A balanced workout can help improve "
        "your overall fitness."
    )

    if goal:

        goal_type = goal.goal_type.lower()

        if "weight" in goal_type:

            fitness_focus = "Weight Loss"
            recommendation = "Cardio Workout"
            difficulty_level = "Intermediate"
            suggested_duration = 40

            reason = (
                "Cardio exercises can support your "
                "weight management goal."
            )

        elif "muscle" in goal_type:

            fitness_focus = "Muscle Gain"
            recommendation = "Strength Training"
            difficulty_level = "Intermediate"
            suggested_duration = 45

            reason = (
                "Strength exercises can help support "
                "muscle development."
            )

        elif "step" in goal_type:

            fitness_focus = "Daily Activity"
            recommendation = "Walking Workout"
            difficulty_level = "Beginner"
            suggested_duration = 30

            reason = (
                "Walking regularly can help you "
                "increase your daily activity."
            )

    # --------------------------------------
    # ANALYZE WORKOUT HISTORY
    # --------------------------------------

    if workouts:

        if len(workouts) >= 5:

            difficulty_level = "Advanced"

        elif len(workouts) >= 2:

            difficulty_level = "Intermediate"

        last_workout = workouts[0]

        days_since_workout = (
            today - last_workout.workout_date
        ).days

        if days_since_workout == 0:

            reason += (
                " You have already exercised today. "
                "Consider recovery or light activity."
            )

        elif days_since_workout >= 3:

            reason += (
                " You have had a break from workouts. "
                "Start with a manageable session."
            )

    else:

        reason += (
            " Start with simple exercises and "
            "gradually increase intensity."
        )

    # --------------------------------------
    # STREAK ANALYSIS
    # --------------------------------------

    if current_streak >= 7:

        reason += (
            " Excellent consistency! Keep maintaining "
            "your workout routine."
        )

    elif current_streak == 0:

        reason += (
            " Start building your workout streak "
            "with regular exercise."
        )

    # --------------------------------------
    # SELECT EXERCISES
    # --------------------------------------

    exercises_query = db.query(Exercise)

    if fitness_focus == "Weight Loss":

        exercises_query = exercises_query.filter(
            Exercise.category.ilike("%cardio%")
        )

    elif fitness_focus == "Muscle Gain":

        exercises_query = exercises_query.filter(
            Exercise.category.ilike("%strength%")
        )

    elif fitness_focus == "Daily Activity":

        exercises_query = exercises_query.filter(
            Exercise.exercise_name.ilike("%walk%")
        )

    suggested_exercises = exercises_query.limit(5).all()

    # If no matching exercises exist, show general exercises.
    if not suggested_exercises:

        suggested_exercises = db.query(
            Exercise
        ).limit(5).all()

    # --------------------------------------
    # FORMAT EXERCISE RECOMMENDATIONS
    # --------------------------------------

    exercise_results = []

    for exercise in suggested_exercises:

        exercise_results.append(
            SuggestedExercise(
                exercise_name=exercise.exercise_name,
                category=exercise.category,
                muscle_group=exercise.muscle_group,
                difficulty=exercise.difficulty,
                reason=(
                    "Selected based on your fitness focus."
                )
            )
        )

    # --------------------------------------
    # RESPONSE
    # --------------------------------------

    based_on = [
        "Fitness goals",
        "Workout history",
        "Workout consistency",
        "Exercise library"
    ]

    if not workouts:
        based_on.append(
            "Beginner-friendly recommendations"
        )

    return WorkoutSuggestionResponse(
        recommendation=recommendation,
        fitness_focus=fitness_focus,
        suggested_duration=suggested_duration,
        difficulty_level=difficulty_level,
        reason=reason,
        based_on=based_on,
        suggested_exercises=exercise_results
    )