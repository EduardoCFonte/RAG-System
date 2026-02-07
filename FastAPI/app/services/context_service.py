from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from .. import models, schemas 
from ..core.security import get_password_hash
from datetime import datetime

def context_service(db: Session, chatSchema: schemas.createContext) -> models.Chat:
    """
    Cria um novo usuário no banco de dados.
    """
    db_chat = db.query(models.Chat).filter(models.Chat.context_name == chatSchema.context , models.Chat.user_email == chatSchema.email).first()
    if db_chat:
        raise HTTPException(status_code=400, detail="Context already exists")

    newChat = models.Chat(
        user_email = chatSchema.email,
        context_name = chatSchema.context,
        created_at = datetime.utcnow(),
        files=chatSchema.files if hasattr(chatSchema, 'files') else []
    )

    db.add(newChat)
    db.commit()
    db.refresh(newChat)

    return newChat
