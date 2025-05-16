from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class SupportInteractionBase(BaseModel):
    message: str

class SupportInteractionCreate(SupportInteractionBase):
    support_ticket_id: int
    user_id: Optional[int] = None

class SupportInteraction(SupportInteractionBase):
    id: int
    support_ticket_id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True

class SupportTicketBase(BaseModel):
    subject: str
    description: str
    priority: TicketPriority = TicketPriority.MEDIUM
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class SupportTicketCreate(SupportTicketBase):
    user_id: Optional[int] = None

class SupportTicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    support_agent_id: Optional[int] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class SupportTicket(SupportTicketBase):
    id: int
    ticket_reference: str
    user_id: Optional[int] = None
    support_agent_id: Optional[int] = None
    status: TicketStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    interactions: List[SupportInteraction] = []

    class Config:
        orm_mode = True
