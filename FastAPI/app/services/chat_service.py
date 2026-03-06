from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from .. import models, schemas 
from ..core.security import get_password_hash
from datetime import datetime

# async def chat_service(user: models.User) -> bool:
#     db_chat = db.query(models.Chat).filter(
#         models.Chat.context_name == ctx_id,
#         models.Chat.user_email == email
#     ).first()

#     if not db_chat:
#         return False

#     try:
#         db.delete(db_chat)
#         db.commit()
#         return True
#     except Exception as e:
#         db.rollback()
#         print(f"Erro ao deletar: {e}")
#         return False