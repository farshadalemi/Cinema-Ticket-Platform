from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status
from ..repositories.ticket_repository import TicketRepository
from ..schemas.ticket import BookingCreate, BookingUpdate, PaymentCreate, PaymentUpdate

class TicketService:
    def __init__(self):
        self.repository = TicketRepository()
    
    def get_bookings(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        user_id: Optional[int] = None,
        status: Optional[str] = None
    ):
        return self.repository.get_bookings(
            db, 
            skip=skip, 
            limit=limit,
            user_id=user_id,
            status=status
        )
    
    def get_booking(self, db: Session, booking_id: int):
        db_booking = self.repository.get_booking(db, booking_id=booking_id)
        if db_booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        return db_booking
    
    def get_booking_by_reference(self, db: Session, booking_reference: str):
        db_booking = self.repository.get_booking_by_reference(db, booking_reference=booking_reference)
        if db_booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        return db_booking
    
    def create_booking(self, db: Session, booking: BookingCreate):
        # Check if seats are available
        available_seats = self.repository.get_available_seats(db, booking.showtime_id)
        available_seat_ids = [seat.id for seat in available_seats]
        
        # Validate that all requested seats are available
        for seat_id in booking.seat_ids:
            if seat_id not in available_seat_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Seat with ID {seat_id} is not available"
                )
        
        return self.repository.create_booking(db=db, booking=booking)
    
    def update_booking(self, db: Session, booking_id: int, booking_update: BookingUpdate):
        # Check if booking exists
        db_booking = self.repository.get_booking(db, booking_id=booking_id)
        if db_booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return self.repository.update_booking(db=db, booking_id=booking_id, booking_update=booking_update)
    
    def create_payment(self, db: Session, payment: PaymentCreate):
        # Check if booking exists
        db_booking = self.repository.get_booking(db, booking_id=payment.booking_id)
        if db_booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check if payment already exists for this booking
        if db_booking.payment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment already exists for this booking"
            )
        
        # Validate payment amount matches booking total
        if payment.amount != db_booking.total_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment amount {payment.amount} does not match booking total {db_booking.total_price}"
            )
        
        return self.repository.create_payment(db=db, payment=payment)
    
    def update_payment(self, db: Session, payment_id: int, payment_update: PaymentUpdate):
        # Process payment update (in a real app, this would integrate with a payment gateway)
        db_payment = self.repository.update_payment(db=db, payment_id=payment_id, payment_update=payment_update)
        if db_payment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # If payment is completed, update booking status to confirmed
        if db_payment.status == "completed":
            booking_update = BookingUpdate(status="confirmed")
            self.repository.update_booking(db=db, booking_id=db_payment.booking_id, booking_update=booking_update)
        
        return db_payment
    
    def get_available_seats(self, db: Session, showtime_id: int):
        return self.repository.get_available_seats(db, showtime_id=showtime_id)
