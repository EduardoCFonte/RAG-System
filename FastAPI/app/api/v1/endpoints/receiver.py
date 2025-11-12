from fastapi import APIRouter, Depends, HTTPException, status, UploadFile,File, Request
from sqlalchemy.orm import Session
from app import schemas, services, models, parser
from app.core.database import get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.load_env import settings
from app.core.security import create_token

router = APIRouter()

@router.post("/upload-documents", response_model=schemas.Token)
async def parse_documents(files: list[UploadFile] = File(...), request: Request = None):
    """
    Endpoint de login. Recebe email e senha e retorna um token de acesso.
    """
    parser_instance = parser.pdf_parser()
    textos_dos_pdfs = await parser_instance.read_pdf(files)
    return {"access_token": "poooo", "token_type": "bearer"}
