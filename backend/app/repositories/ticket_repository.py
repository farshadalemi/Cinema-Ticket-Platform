from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from ..models.ticket import Booking, SeatBooking, Payment
from ..models.showtime import Showtime, Seat
from ..schemas.ticket import BookingCreate, BookingUpdate, PaymentCreate, PaymentUpdate

class TicketRepository:
    def get_bookings(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        user_id: Optional[int] = None,
        status: Optional[str] = None
    ):
        query = db.query(Booking)
        
        if user_id:
            query = query.filter(Booking.user_id == user_id)
        
        if status:
            query = query.filter(Booking.status == status)
        
        return query.offset(skip).limit(limit).all()
    
    def get_booking(self, db: Session, booking_id: int):
        return db.query(Booking).filter(Booking.id == booking_id).first()
    
    def get_booking_by_reference(self, db: Session, booking_reference: str):
        return db.query(Booking).filter(Booking.booking_reference == booking_reference).first()
    
    def create_booking(self, db: Session, booking: BookingCreate):
        # Generate a unique booking reference
        booking_reference = str(uuid.uuid4())[:8].upper()
        
        # Calculate total price based on seats
        total_price = 0
        showtime = db.query(Showtime).filter(Showtime.id == booking.showtime_id).first()
        
        # Create booking
        db_booking = Booking(
            user_id=booking.user_id,
            showtime_id=booking.showtime_id,
            booking_reference=booking_reference,
            total_price=total_price,  # Will be updated after adding seats
            created_by_support=booking.created_by_support,
            support_agent_id=booking.support_agent_id
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        
        # Add seat bookings
        for seat_id in booking.seat_ids:
            seat = db.query(Seat).filter(Seat.id == seat_id).first()
            
            # Calculate seat price based on seat type
            seat_price = showtime.price
            if seat.seat_type == "premium":
                seat_price *= 1.5
            elif seat.seat_type == "vip":
                seat_price *= 2
            
            db_seat_booking = SeatBooking(
                booking_id=db_booking.id,
                seat_id=seat_id,
                price=seat_price
            )
            db.add(db_seat_booking)
            total_price += seat_price
        
        # Update total price
        db_booking.total_price = total_price
        db.commit()
        db.refresh(db_booking)
        return db_booking
    
    def update_booking(self, db: Session, booking_id: int, booking_update: BookingUpdate):
        db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not db_booking:
            return None
        
        # Update booking attributes
        update_data = booking_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_booking, key, value)
        
        db.commit()
        db.refresh(db_booking)
        return db_booking
    
    def create_payment(self, db: Session, payment: PaymentCreate):
        db_payment = Payment(
            booking_id=payment.booking_id,
            amount=payment.amount,
            payment_method=payment.payment_method,
            payment_details=payment.payment_details
        )
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    
    def update_payment(self, db: Session, payment_id: int, payment_update: PaymentUpdate):
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not db_payment:
            return None
        
        # Update payment attributes
        update_data = payment_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_payment, key, value)
        
        db.commit()
        db.refresh(db_payment)
        return db_payment
    
    def get_available_seats(self, db: Session, showtime_id: int):
        # Get all seats for the theater
        showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
        if not showtime:
            return []
        
        all_seats = db.query(Seat).filter(Seat.theater_id == showtime.theater_id).all()
        
        # Get booked seats for this showtime
        booked_seat_ids = db.query(SeatBooking.seat_id)\
            .join(Booking)\
            .filter(Booking.showtime_id == showtime_id)\
            .filter(Booking.status.in_(["pending", "confirmed"]))\
            .all()
        
        booked_seat_ids = [seat_id for (seat_id,) in booked_seat_ids]
        
        # Filter out booked seats
        available_seats = [seat for seat in all_seats if seat.id not in booked_seat_ids]
        
        return available_seats
