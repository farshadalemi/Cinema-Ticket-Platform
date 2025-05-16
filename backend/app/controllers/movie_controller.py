from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..utils.database import get_db
from ..services.movie_service import MovieService
from ..schemas.movie import Movie, MovieCreate, MovieUpdate, Genre, GenreCreate
from ..schemas.user import User
from ..middleware.auth_middleware import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
    responses={404: {"description": "Not found"}},
)

movie_service = MovieService()

@router.get("/", response_model=List[Movie])
def read_movies(
    skip: int = 0, 
    limit: int = 100,
    title: Optional[str] = None,
    genre_id: Optional[int] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    movies = movie_service.get_movies(
        db, 
        skip=skip, 
        limit=limit,
        title_search=title,
        genre_id=genre_id,
        is_active=is_active
    )
    return movies

@router.get("/{movie_id}", response_model=Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    return movie_service.get_movie(db, movie_id=movie_id)

@router.post("/", response_model=Movie)
def create_movie(
    movie: MovieCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return movie_service.create_movie(db=db, movie=movie)

@router.put("/{movie_id}", response_model=Movie)
def update_movie(
    movie_id: int, 
    movie: MovieUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return movie_service.update_movie(db=db, movie_id=movie_id, movie=movie)

@router.delete("/{movie_id}", response_model=Movie)
def delete_movie(
    movie_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return movie_service.delete_movie(db=db, movie_id=movie_id)

# Genre endpoints
@router.get("/genres/", response_model=List[Genre])
def read_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    genres = movie_service.get_genres(db, skip=skip, limit=limit)
    return genres

@router.get("/genres/{genre_id}", response_model=Genre)
def read_genre(genre_id: int, db: Session = Depends(get_db)):
    return movie_service.get_genre(db, genre_id=genre_id)

@router.post("/genres/", response_model=Genre)
def create_genre(
    genre: GenreCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return movie_service.create_genre(db=db, genre=genre)
