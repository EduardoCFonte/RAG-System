from app.core.load_env import settings
import os
from sqlalchemy.orm import Session
from .. import models

async def GetChromaContext(db: Session,email:str) -> models.Chat:
    
    ContextNames = db.query(models.Chat).filter(models.Chat.user_email == email).distinct.all()
    return [row.context_name for row in ContextNames]