from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .movie import Movie

class TheaterBase(BaseModel):
    name: str
    capacity: int

class TheaterCreate(TheaterBase):
    pass

class Theater(TheaterBase):
    id: int

    class Config:
        orm_mode = True

class SeatBase(BaseModel):
    theater_id: int
    row: str
    number: int
    seat_type: str

class SeatCreate(SeatBase):
    pass

class Seat(SeatBase):
    id: int

    class Config:
        orm_mode = True

class ShowtimeBase(BaseModel):
    movie_id: int
    theater_id: int
    start_time: datetime
    end_time: datetime
    price: float
    is_active: bool = True

class ShowtimeCreate(ShowtimeBase):
    pass

class ShowtimeUpdate(BaseModel):
    movie_id: Optional[int] = None
    theater_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None

class Showtime(ShowtimeBase):
    id: int
    created_at: datetime
    movie: Optional[Movie] = None
    theater: Optional[Theater] = None

    class Config:
        orm_mode = True
