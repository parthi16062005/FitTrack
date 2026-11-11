from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Meal
from schemas import MealCreate, MealResponse, NutritionSummary
from auth import get_current_user


router = APIRouter(
    prefix="/nutrition",
    tags=["Nutrition & Meal Tracking"]
)


# ==========================================
# ADD MEAL
# ==========================================

@router.post("/meals", response_model=MealResponse)
def add_meal(
    meal_data: MealCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meal = Meal(
        user_id=current_user.id,
        meal_type=meal_data.meal_type,
        food_name=meal_data.food_name,
        calories=meal_data.calories,
        protein=meal_data.protein,
        carbs=meal_data.carbs,
        fats=meal_data.fats
    )

    db.add(meal)
    db.commit()
    db.refresh(meal)

    return meal


# ==========================================
# GET ALL MEALS
# ==========================================

@router.get("/meals", response_model=list[MealResponse])
def get_meals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return (
        db.query(Meal)
        .filter(Meal.user_id == current_user.id)
        .order_by(Meal.created_at.desc())
        .all()
    )


# ==========================================
# DAILY NUTRITION SUMMARY
# ==========================================

@router.get("/summary", response_model=NutritionSummary)
def get_nutrition_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    today = date.today()

    summary = db.query(
        func.coalesce(func.sum(Meal.calories), 0),
        func.coalesce(func.sum(Meal.protein), 0),
        func.coalesce(func.sum(Meal.carbs), 0),
        func.coalesce(func.sum(Meal.fats), 0),
        func.count(Meal.id)
    ).filter(
        Meal.user_id == current_user.id,
        func.date(Meal.created_at) == today
    ).first()

    return NutritionSummary(
        total_calories=summary[0],
        total_protein=summary[1],
        total_carbs=summary[2],
        total_fats=summary[3],
        total_meals=summary[4]
    )


# ==========================================
# DELETE MEAL
# ==========================================

@router.delete("/meals/{meal_id}")
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()

    if not meal:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    db.delete(meal)
    db.commit()

    return {"message": "Meal deleted successfully"}