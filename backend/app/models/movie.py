from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..utils.database import Base

class Genre(Base):
    __tablename__ = "genres"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    # Relationship
    movies = relationship("MovieGenre", back_populates="genre")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    duration_minutes = Column(Integer)
    release_date = Column(DateTime)
    poster_url = Column(String)
    trailer_url = Column(String)
    rating = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    genres = relationship("MovieGenre", back_populates="movie")
    showtimes = relationship("Showtime", back_populates="movie")

class MovieGenre(Base):
    __tablename__ = "movie_genres"
    
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    genre_id = Column(Integer, ForeignKey("genres.id"))
    
    # Relationships
    movie = relationship("Movie", back_populates="genres")
    genre = relationship("Genre", back_populates="movies")
