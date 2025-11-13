from fastapi import APIRouter, Depends, HTTPException, status, UploadFile,File, Request
from sqlalchemy.orm import Session
from app import schemas, services, models
from app.core.database import get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.load_env import settings
from jose import JWTError, jwt   
from app.parser.pdf_parser import parser

router = APIRouter()

@router.post("/upload-documents", response_model=schemas.Token)
async def parse_documents(files: list[UploadFile] = File(...), request: Request = None):
    """
    Endpoint que receber os PDFs
    """
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = None
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    print(payload)
    email: str = payload.get("sub")
    if not email:
        raise Exception
    textos_dos_pdfs = await parser.read_pdf(email,files)
    return {"access_token": "poooo", "token_type": "bearer"}
