from fastapi import APIRouter, Depends, HTTPException, status, UploadFile,File, Request, Form
from sqlalchemy.orm import Session
from app import schemas, services, models
from app.core.database import get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.load_env import settings
from jose import JWTError, jwt   
from app.parser.pdf_parser import parser

router = APIRouter()

@router.post("/upload-documents", response_model=schemas.UploadSuccess)
async def parse_documents(context: str = Form(...),files: list[UploadFile] = File(...), email: str = Depends(services.get_current_user_email),db: Session = Depends(get_db)):
    """
    Endpoint que receber os PDFs
    """
    try:
        await parser.read_pdf(email=email, context=context, files=files)
        
        return {
            "status": "success",
            "message": f"Documentos processados com sucesso no contexto '{context}'",
            "context": context,
            "files_count": len(files)
        }
        
    except Exception as e:
        print(f"Erro no processamento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar documentos: {str(e)}"
        )



