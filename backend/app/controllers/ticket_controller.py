from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..utils.database import get_db
from ..services.ticket_service import TicketService
from ..schemas.ticket import Booking, BookingCreate, BookingUpdate, Payment, PaymentCreate, PaymentUpdate
from ..schemas.showtime import Seat
from ..schemas.user import User
from ..middleware.auth_middleware import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    responses={404: {"description": "Not found"}},
)

ticket_service = TicketService()

@router.get("/bookings/", response_model=List[Booking])
def read_bookings(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Regular users can only see their own bookings
    if not current_user.is_admin:
        bookings = ticket_service.get_bookings(
            db, 
            skip=skip, 
            limit=limit,
            user_id=current_user.id,
            status=status
        )
    else:
        # Admins can see all bookings
        bookings = ticket_service.get_bookings(
            db, 
            skip=skip, 
            limit=limit,
            status=status
        )
    return bookings

@router.get("/bookings/{booking_id}", response_model=Booking)
def read_booking(
    booking_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = ticket_service.get_booking(db, booking_id=booking_id)
    
    # Check if user has permission to view this booking
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this booking"
        )
    
    return booking

@router.get("/bookings/reference/{booking_reference}", response_model=Booking)
def read_booking_by_reference(
    booking_reference: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = ticket_service.get_booking_by_reference(db, booking_reference=booking_reference)
    
    # Check if user has permission to view this booking
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this booking"
        )
    
    return booking

@router.post("/bookings/", response_model=Booking)
def create_booking(
    booking: BookingCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Regular users can only create bookings for themselves
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create booking for another user"
        )
    
    return ticket_service.create_booking(db=db, booking=booking)

@router.put("/bookings/{booking_id}", response_model=Booking)
def update_booking(
    booking_id: int, 
    booking_update: BookingUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the booking to check permissions
    booking = ticket_service.get_booking(db, booking_id=booking_id)
    
    # Check if user has permission to update this booking
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this booking"
        )
    
    return ticket_service.update_booking(db=db, booking_id=booking_id, booking_update=booking_update)

@router.get("/showtimes/{showtime_id}/seats", response_model=List[Seat])
def read_available_seats(
    showtime_id: int, 
    db: Session = Depends(get_db)
):
    return ticket_service.get_available_seats(db, showtime_id=showtime_id)

@router.post("/payments/", response_model=Payment)
def create_payment(
    payment: PaymentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the booking to check permissions
    booking = ticket_service.get_booking(db, booking_id=payment.booking_id)
    
    # Check if user has permission to create payment for this booking
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create payment for this booking"
        )
    
    return ticket_service.create_payment(db=db, payment=payment)

@router.put("/payments/{payment_id}", response_model=Payment)
def update_payment(
    payment_id: int, 
    payment_update: PaymentUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Only admins can update payment status
    return ticket_service.update_payment(db=db, payment_id=payment_id, payment_update=payment_update)
