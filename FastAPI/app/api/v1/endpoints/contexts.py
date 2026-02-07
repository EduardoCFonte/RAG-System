from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app import schemas, services, models
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/contexts") 
async def read_users_me(request: Request, db: Session = Depends(get_db)):
    email = await services.get_current_user_email(request)
    folder_names = await services.GetChromaContext(db,email)
    formatado = [{"id": name, "name": name} for name in folder_names]
    
    return {"ContextsList": formatado}



@router.get("/contexts/select/{ctx_id}", response_model=schemas.chatHistory) 
async def post_contexts(ctx_id:str, request: Request, db: Session = Depends(get_db)):
    email = await services.get_current_user_email(request)
    folder_names = services.GetChromaContext(db,email)

    if ctx_id not in folder_names:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contexto '{ctx_id}' não encontrado no storage."
        )
    
    try:
        chat_registro = db.query(models.Chat).filter(
            models.Chat.user_email == email, 
            models.Chat.context_name == ctx_id
        ).first()

        if not chat_registro:
            return {"chat": []}

        messages_all = db.query(models.Message).filter(
            models.Message.conversa_id == chat_registro.id
        ).order_by(models.Message.timestamp.asc()).all() 

        return {"History": messages_all}

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao consultar banco de dados: {str(error)}"
        )