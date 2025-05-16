from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.movie import Movie, Genre, MovieGenre
from ..schemas.movie import MovieCreate, MovieUpdate

class MovieRepository:
    def get_movies(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        title_search: Optional[str] = None,
        genre_id: Optional[int] = None,
        is_active: Optional[bool] = None
    ):
        query = db.query(Movie)
        
        if title_search:
            query = query.filter(Movie.title.ilike(f"%{title_search}%"))
        
        if genre_id:
            query = query.join(MovieGenre).filter(MovieGenre.genre_id == genre_id)
        
        if is_active is not None:
            query = query.filter(Movie.is_active == is_active)
        
        return query.offset(skip).limit(limit).all()
    
    def get_movie(self, db: Session, movie_id: int):
        return db.query(Movie).filter(Movie.id == movie_id).first()
    
    def create_movie(self, db: Session, movie: MovieCreate):
        db_movie = Movie(
            title=movie.title,
            description=movie.description,
            duration_minutes=movie.duration_minutes,
            release_date=movie.release_date,
            poster_url=movie.poster_url,
            trailer_url=movie.trailer_url,
            rating=movie.rating,
            is_active=movie.is_active
        )
        db.add(db_movie)
        db.commit()
        db.refresh(db_movie)
        
        # Add genres
        for genre_id in movie.genre_ids:
            db_movie_genre = MovieGenre(movie_id=db_movie.id, genre_id=genre_id)
            db.add(db_movie_genre)
        
        db.commit()
        db.refresh(db_movie)
        return db_movie
    
    def update_movie(self, db: Session, movie_id: int, movie: MovieUpdate):
        db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
        if not db_movie:
            return None
        
        # Update movie attributes
        update_data = movie.dict(exclude_unset=True)
        if "genre_ids" in update_data:
            genre_ids = update_data.pop("genre_ids")
            
            # Remove existing genre associations
            db.query(MovieGenre).filter(MovieGenre.movie_id == movie_id).delete()
            
            # Add new genre associations
            for genre_id in genre_ids:
                db_movie_genre = MovieGenre(movie_id=movie_id, genre_id=genre_id)
                db.add(db_movie_genre)
        
        for key, value in update_data.items():
            setattr(db_movie, key, value)
        
        db.commit()
        db.refresh(db_movie)
        return db_movie
    
    def delete_movie(self, db: Session, movie_id: int):
        db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
        if not db_movie:
            return None
        
        # Instead of deleting, set is_active to False
        db_movie.is_active = False
        db.commit()
        return db_movie
    
    # Genre methods
    def get_genres(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Genre).offset(skip).limit(limit).all()
    
    def get_genre(self, db: Session, genre_id: int):
        return db.query(Genre).filter(Genre.id == genre_id).first()
    
    def create_genre(self, db: Session, name: str):
        db_genre = Genre(name=name)
        db.add(db_genre)
        db.commit()
        db.refresh(db_genre)
        return db_genre
