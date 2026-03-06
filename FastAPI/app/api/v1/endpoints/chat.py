from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from sqlalchemy.orm import Session
from app import schemas, services, models
from app.core.database import get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.load_env import settings
from app.core.security import create_token
from app.core.security import get_current_user
from app.parser.pdf_parser import parser

router = APIRouter()

@router.post("/chat")
async def chat_with_docs(request:schemas.ChatRequest ,current_user: models.User = Depends(get_current_user) , db: Session = Depends(get_db)):
    """
    Tests
    """
    try:
        context_name = request.context_name
        question = request.question
        context_extracted = parser.search_context(current_user.email, context_name)
        if not context_extracted:
            raise HTTPException(status_code=500, detail=str(e))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # user = await services.get_current_user(request)
    # if not email:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Email ou senha incorretos",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )

    # access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # access_token = create_token(
    #     data={"sub": user.email}, expires_delta=access_token_expires
    # )
    return {"access_token":"hi"}
