from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status
from ..repositories.support_repository import SupportRepository
from ..schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportInteractionCreate

class SupportService:
    def __init__(self):
        self.repository = SupportRepository()
    
    def get_support_tickets(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        user_id: Optional[int] = None,
        support_agent_id: Optional[int] = None,
        status: Optional[str] = None
    ):
        return self.repository.get_support_tickets(
            db, 
            skip=skip, 
            limit=limit,
            user_id=user_id,
            support_agent_id=support_agent_id,
            status=status
        )
    
    def get_support_ticket(self, db: Session, ticket_id: int):
        db_ticket = self.repository.get_support_ticket(db, ticket_id=ticket_id)
        if db_ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found"
            )
        return db_ticket
    
    def get_support_ticket_by_reference(self, db: Session, ticket_reference: str):
        db_ticket = self.repository.get_support_ticket_by_reference(db, ticket_reference=ticket_reference)
        if db_ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found"
            )
        return db_ticket
    
    def create_support_ticket(self, db: Session, ticket: SupportTicketCreate):
        return self.repository.create_support_ticket(db=db, ticket=ticket)
    
    def update_support_ticket(self, db: Session, ticket_id: int, ticket_update: SupportTicketUpdate):
        # Check if ticket exists
        db_ticket = self.repository.get_support_ticket(db, ticket_id=ticket_id)
        if db_ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found"
            )
        
        return self.repository.update_support_ticket(db=db, ticket_id=ticket_id, ticket_update=ticket_update)
    
    def create_support_interaction(self, db: Session, interaction: SupportInteractionCreate):
        # Check if ticket exists
        db_ticket = self.repository.get_support_ticket(db, ticket_id=interaction.support_ticket_id)
        if db_ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found"
            )
        
        return self.repository.create_support_interaction(db=db, interaction=interaction)
    
    def get_support_interactions(self, db: Session, ticket_id: int):
        # Check if ticket exists
        db_ticket = self.repository.get_support_ticket(db, ticket_id=ticket_id)
        if db_ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found"
            )
        
        return self.repository.get_support_interactions(db, ticket_id=ticket_id)
