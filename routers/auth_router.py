from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserRegister, UserLogin, UserResponse
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REGISTER
# ==========================================

@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        (User.username == user_data.username) |
        (User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================================
# LOGIN - FRONTEND
# ==========================================

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == user_data.username
    ).first()

    if not user or not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token = create_access_token({
        "sub": str(user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }


# ==========================================
# SWAGGER LOGIN - USERNAME AND PASSWORD
# ==========================================

@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token = create_access_token({
        "sub": str(user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ==========================================
# GET CURRENT USER
# ==========================================

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user