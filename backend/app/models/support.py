from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..utils.database import Base

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    support_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ticket_reference = Column(String, unique=True, index=True)
    subject = Column(String)
    description = Column(Text)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    support_agent = relationship("User", foreign_keys=[support_agent_id])
    interactions = relationship("SupportInteraction", back_populates="support_ticket")

class SupportInteraction(Base):
    __tablename__ = "support_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    support_ticket_id = Column(Integer, ForeignKey("support_tickets.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    support_ticket = relationship("SupportTicket", back_populates="interactions")
    user = relationship("User")
