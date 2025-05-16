from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from ..models.support import SupportTicket, SupportInteraction
from ..schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportInteractionCreate

class SupportRepository:
    def get_support_tickets(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        user_id: Optional[int] = None,
        support_agent_id: Optional[int] = None,
        status: Optional[str] = None
    ):
        query = db.query(SupportTicket)
        
        if user_id:
            query = query.filter(SupportTicket.user_id == user_id)
        
        if support_agent_id:
            query = query.filter(SupportTicket.support_agent_id == support_agent_id)
        
        if status:
            query = query.filter(SupportTicket.status == status)
        
        return query.offset(skip).limit(limit).all()
    
    def get_support_ticket(self, db: Session, ticket_id: int):
        return db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    
    def get_support_ticket_by_reference(self, db: Session, ticket_reference: str):
        return db.query(SupportTicket).filter(SupportTicket.ticket_reference == ticket_reference).first()
    
    def create_support_ticket(self, db: Session, ticket: SupportTicketCreate):
        # Generate a unique ticket reference
        ticket_reference = f"SUP-{str(uuid.uuid4())[:6].upper()}"
        
        db_ticket = SupportTicket(
            user_id=ticket.user_id,
            ticket_reference=ticket_reference,
            subject=ticket.subject,
            description=ticket.description,
            priority=ticket.priority,
            contact_phone=ticket.contact_phone,
            contact_email=ticket.contact_email
        )
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket
    
    def update_support_ticket(self, db: Session, ticket_id: int, ticket_update: SupportTicketUpdate):
        db_ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not db_ticket:
            return None
        
        # Update ticket attributes
        update_data = ticket_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_ticket, key, value)
        
        db.commit()
        db.refresh(db_ticket)
        return db_ticket
    
    def create_support_interaction(self, db: Session, interaction: SupportInteractionCreate):
        db_interaction = SupportInteraction(
            support_ticket_id=interaction.support_ticket_id,
            user_id=interaction.user_id,
            message=interaction.message
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return db_interaction
    
    def get_support_interactions(self, db: Session, ticket_id: int):
        return db.query(SupportInteraction)\
            .filter(SupportInteraction.support_ticket_id == ticket_id)\
            .order_by(SupportInteraction.created_at)\
            .all()
