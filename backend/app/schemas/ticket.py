from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"
    CASH = "cash"

class SeatBookingBase(BaseModel):
    seat_id: int
    price: float

class SeatBookingCreate(SeatBookingBase):
    pass

class SeatBooking(SeatBookingBase):
    id: int
    booking_id: int

    class Config:
        orm_mode = True

class PaymentBase(BaseModel):
    amount: float
    payment_method: PaymentMethod
    payment_details: Optional[str] = None

class PaymentCreate(PaymentBase):
    booking_id: int

class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    transaction_id: Optional[str] = None

class Payment(PaymentBase):
    id: int
    booking_id: int
    status: PaymentStatus
    transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    showtime_id: int
    created_by_support: bool = False
    support_agent_id: Optional[int] = None

class BookingCreate(BookingBase):
    user_id: int
    seat_ids: List[int]

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None

class Booking(BookingBase):
    id: int
    user_id: int
    booking_reference: str
    status: BookingStatus
    total_price: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    seat_bookings: List[SeatBooking]
    payment: Optional[Payment] = None

    class Config:
        orm_mode = True
