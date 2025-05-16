from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status
from ..repositories.movie_repository import MovieRepository
from ..schemas.movie import MovieCreate, MovieUpdate, Movie, Genre, GenreCreate

class MovieService:
    def __init__(self):
        self.repository = MovieRepository()
    
    def get_movies(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        title_search: Optional[str] = None,
        genre_id: Optional[int] = None,
        is_active: Optional[bool] = None
    ):
        return self.repository.get_movies(
            db, 
            skip=skip, 
            limit=limit,
            title_search=title_search,
            genre_id=genre_id,
            is_active=is_active
        )
    
    def get_movie(self, db: Session, movie_id: int):
        db_movie = self.repository.get_movie(db, movie_id=movie_id)
        if db_movie is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )
        return db_movie
    
    def create_movie(self, db: Session, movie: MovieCreate):
        # Validate that all genre IDs exist
        for genre_id in movie.genre_ids:
            genre = self.repository.get_genre(db, genre_id)
            if not genre:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Genre with ID {genre_id} not found"
                )
        
        return self.repository.create_movie(db=db, movie=movie)
    
    def update_movie(self, db: Session, movie_id: int, movie: MovieUpdate):
        # Check if movie exists
        db_movie = self.repository.get_movie(db, movie_id=movie_id)
        if db_movie is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )
        
        # Validate genre IDs if provided
        if movie.genre_ids:
            for genre_id in movie.genre_ids:
                genre = self.repository.get_genre(db, genre_id)
                if not genre:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Genre with ID {genre_id} not found"
                    )
        
        return self.repository.update_movie(db=db, movie_id=movie_id, movie=movie)
    
    def delete_movie(self, db: Session, movie_id: int):
        db_movie = self.repository.delete_movie(db, movie_id=movie_id)
        if db_movie is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )
        return db_movie
    
    # Genre methods
    def get_genres(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_genres(db, skip=skip, limit=limit)
    
    def get_genre(self, db: Session, genre_id: int):
        db_genre = self.repository.get_genre(db, genre_id=genre_id)
        if db_genre is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Genre not found"
            )
        return db_genre
    
    def create_genre(self, db: Session, genre: GenreCreate):
        return self.repository.create_genre(db=db, name=genre.name)
