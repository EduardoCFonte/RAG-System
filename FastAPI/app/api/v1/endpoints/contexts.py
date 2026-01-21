from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app import schemas, services, models
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/contexts", response_model=schemas.ContextsList) 
async def read_users_me(request: Request):
    email = await services.get_current_user_email(request)
    list = services.GetChromaContext(email)
    return {"ContextsList": list}