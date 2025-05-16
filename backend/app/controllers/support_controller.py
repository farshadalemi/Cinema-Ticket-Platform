from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..utils.database import get_db
from ..services.support_service import SupportService
from ..schemas.support import SupportTicket, SupportTicketCreate, SupportTicketUpdate, SupportInteraction, SupportInteractionCreate
from ..schemas.user import User
from ..middleware.auth_middleware import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/support",
    tags=["support"],
    responses={404: {"description": "Not found"}},
)

support_service = SupportService()

@router.get("/tickets/", response_model=List[SupportTicket])
def read_support_tickets(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Regular users can only see their own tickets
    if not current_user.is_admin:
        tickets = support_service.get_support_tickets(
            db, 
            skip=skip, 
            limit=limit,
            user_id=current_user.id,
            status=status
        )
    else:
        # Admins can see all tickets or filter by support agent
        support_agent_id = current_user.id if Query(None) else None
        tickets = support_service.get_support_tickets(
            db, 
            skip=skip, 
            limit=limit,
            support_agent_id=support_agent_id,
            status=status
        )
    return tickets

@router.get("/tickets/{ticket_id}", response_model=SupportTicket)
def read_support_ticket(
    ticket_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = support_service.get_support_ticket(db, ticket_id=ticket_id)
    
    # Check if user has permission to view this ticket
    if not current_user.is_admin and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this ticket"
        )
    
    return ticket

@router.get("/tickets/reference/{ticket_reference}", response_model=SupportTicket)
def read_support_ticket_by_reference(
    ticket_reference: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = support_service.get_support_ticket_by_reference(db, ticket_reference=ticket_reference)
    
    # Check if user has permission to view this ticket
    if not current_user.is_admin and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this ticket"
        )
    
    return ticket

@router.post("/tickets/", response_model=SupportTicket)
def create_support_ticket(
    ticket: SupportTicketCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Set the user_id if not provided
    if not ticket.user_id:
        ticket.user_id = current_user.id
    
    # Regular users can only create tickets for themselves
    if not current_user.is_admin and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create ticket for another user"
        )
    
    return support_service.create_support_ticket(db=db, ticket=ticket)

@router.put("/tickets/{ticket_id}", response_model=SupportTicket)
def update_support_ticket(
    ticket_id: int, 
    ticket_update: SupportTicketUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the ticket to check permissions
    ticket = support_service.get_support_ticket(db, ticket_id=ticket_id)
    
    # Regular users can only update basic info of their own tickets
    if not current_user.is_admin:
        if ticket.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update this ticket"
            )
        
        # Regular users can't assign support agents or change status
        if ticket_update.support_agent_id is not None or ticket_update.status is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update support agent or status"
            )
    
    return support_service.update_support_ticket(db=db, ticket_id=ticket_id, ticket_update=ticket_update)

@router.get("/tickets/{ticket_id}/interactions", response_model=List[SupportInteraction])
def read_support_interactions(
    ticket_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the ticket to check permissions
    ticket = support_service.get_support_ticket(db, ticket_id=ticket_id)
    
    # Check if user has permission to view interactions for this ticket
    if not current_user.is_admin and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access interactions for this ticket"
        )
    
    return support_service.get_support_interactions(db, ticket_id=ticket_id)

@router.post("/interactions/", response_model=SupportInteraction)
def create_support_interaction(
    interaction: SupportInteractionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the ticket to check permissions
    ticket = support_service.get_support_ticket(db, ticket_id=interaction.support_ticket_id)
    
    # Check if user has permission to add interactions to this ticket
    if not current_user.is_admin and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to add interactions to this ticket"
        )
    
    # Set the user_id if not provided
    if not interaction.user_id:
        interaction.user_id = current_user.id
    
    return support_service.create_support_interaction(db=db, interaction=interaction)
