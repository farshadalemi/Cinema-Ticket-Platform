from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..utils.database import Base

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, enum.Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"
    CASH = "cash"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    showtime_id = Column(Integer, ForeignKey("showtimes.id"))
    booking_reference = Column(String, unique=True, index=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    total_price = Column(Float)
    created_by_support = Column(Boolean, default=False)
    support_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    showtime = relationship("Showtime", back_populates="bookings")
    user = relationship("User", foreign_keys=[user_id])
    support_agent = relationship("User", foreign_keys=[support_agent_id])
    seat_bookings = relationship("SeatBooking", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)

class SeatBooking(Base):
    __tablename__ = "seat_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    seat_id = Column(Integer, ForeignKey("seats.id"))
    price = Column(Float)
    
    # Relationships
    booking = relationship("Booking", back_populates="seat_bookings")
    seat = relationship("Seat", back_populates="bookings")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True)
    amount = Column(Float)
    payment_method = Column(Enum(PaymentMethod))
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    transaction_id = Column(String, nullable=True)
    payment_details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    booking = relationship("Booking", back_populates="payment")
