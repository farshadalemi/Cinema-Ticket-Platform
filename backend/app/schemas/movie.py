from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    id: int

    class Config:
        orm_mode = True

class MovieBase(BaseModel):
    title: str
    description: str
    duration_minutes: int
    release_date: datetime
    poster_url: Optional[str] = None
    trailer_url: Optional[str] = None
    rating: Optional[float] = None
    is_active: bool = True

class MovieCreate(MovieBase):
    genre_ids: List[int]

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    release_date: Optional[datetime] = None
    poster_url: Optional[str] = None
    trailer_url: Optional[str] = None
    rating: Optional[float] = None
    is_active: Optional[bool] = None
    genre_ids: Optional[List[int]] = None

class Movie(MovieBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    genres: List[Genre]

    class Config:
        orm_mode = True
