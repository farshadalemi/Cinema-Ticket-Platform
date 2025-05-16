from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..utils.database import Base

class Theater(Base):
    __tablename__ = "theaters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    capacity = Column(Integer)
    
    # Relationships
    showtimes = relationship("Showtime", back_populates="theater")
    seats = relationship("Seat", back_populates="theater")

class Seat(Base):
    __tablename__ = "seats"
    
    id = Column(Integer, primary_key=True, index=True)
    theater_id = Column(Integer, ForeignKey("theaters.id"))
    row = Column(String)
    number = Column(Integer)
    seat_type = Column(String)  # regular, premium, vip, etc.
    
    # Relationships
    theater = relationship("Theater", back_populates="seats")
    bookings = relationship("SeatBooking", back_populates="seat")

class Showtime(Base):
    __tablename__ = "showtimes"
    
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    theater_id = Column(Integer, ForeignKey("theaters.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    price = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    movie = relationship("Movie", back_populates="showtimes")
    theater = relationship("Theater", back_populates="showtimes")
    bookings = relationship("Booking", back_populates="showtime")
