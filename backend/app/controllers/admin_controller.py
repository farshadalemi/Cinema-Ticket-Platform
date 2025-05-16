from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..utils.database import get_db
from ..services.auth_service import AuthService
from ..schemas.user import User, UserCreate, UserUpdate
from ..middleware.auth_middleware import get_current_admin_user
from ..repositories.auth_repository import AuthRepository

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)

auth_service = AuthService()
auth_repository = AuthRepository()

@router.get("/users/", response_model=List[User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=User)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_user = auth_repository.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/users/", response_model=User)
def create_user(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return auth_service.register_user(db=db, user=user)

@router.put("/users/{user_id}", response_model=User)
def update_user(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_user = auth_repository.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user attributes
    update_data = user_update.dict(exclude_unset=True)
    
    # Handle password update separately
    if "password" in update_data:
        from ..utils.security import get_password_hash
        password = update_data.pop("password")
        db_user.hashed_password = get_password_hash(password)
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", response_model=User)
def deactivate_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_user = auth_repository.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Instead of deleting, set is_active to False
    db_user.is_active = False
    db.commit()
    db.refresh(db_user)
    return db_user
