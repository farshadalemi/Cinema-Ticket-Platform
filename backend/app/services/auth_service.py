from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi import HTTPException, status
from ..repositories.auth_repository import AuthRepository
from ..schemas.user import UserCreate, User, Token
from ..utils.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

class AuthService:
    def __init__(self):
        self.repository = AuthRepository()
    
    def register_user(self, db: Session, user: UserCreate):
        # Check if username already exists
        db_user = self.repository.get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        db_user = self.repository.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        return self.repository.create_user(db=db, user=user)
    
    def login(self, db: Session, username: str, password: str):
        user = self.repository.authenticate_user(db, username, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "user_id": user.id, "is_admin": user.is_admin},
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, token_type="bearer")
    
    def get_current_user(self, db: Session, user_id: int):
        user = self.repository.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
