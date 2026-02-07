from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, UniqueConstraint, Integer, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base 
from app import models

class Chat(Base):
    """
    Chat between an user and context
    """
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    context_name = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    files = Column(JSON, nullable=True, default=[])


    __table_args__ = (
        UniqueConstraint('user_email', 'context_name', name='_user_context_uc'),
    )

    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class Message(Base):
    """
    Represent each message individually
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    conversa_id = Column(Integer, ForeignKey("chat.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(String, nullable=False) 
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    chat = relationship("Chat", back_populates="messages")