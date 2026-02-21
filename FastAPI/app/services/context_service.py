from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from .. import models, schemas 
from ..core.security import get_password_hash
from datetime import datetime

def context_service(db: Session, chatSchema: schemas.createContext) -> models.Chat:
    """
    Creates a new Chat in the DB
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


async def context_delete(db:Session, ctx_id:str, email:str) -> bool:
    db_chat = db.query(models.Chat).filter(
        models.Chat.context_name == ctx_id,
        models.Chat.user_email == email
    ).first()

    if not db_chat:
        return False

    try:
        db.delete(db_chat)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Erro ao deletar: {e}")
        return False