from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from .core.database import SessionLocal, engine
from . import models
from fastapi.middleware.cors import CORSMiddleware 
from datetime import datetime
from .api.v1.router import router as api_v1_router
from contextlib import asynccontextmanager
import nltk
from langchain_huggingface import HuggingFaceEmbeddings

# Importe o nosso "armazém" de modelos
from .core.ml_model import ml_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("A iniciar a aplicação...")
    print("A descarregar o modelo 'punkt' do NLTK...")
    nltk.download('punkt')
    
    print("A carregar o modelo de embedding (ex: 'all-MiniLM-L6-v2')...")
    ml_models["embeddings_model"] = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs = {'device': 'cuda'} 
)
    print("Modelo de embedding carregado com sucesso!")

    yield
    ml_models.clear()

app = FastAPI(title="Minha API de Exemplo", lifespan=lifespan)

models.Base.metadata.create_all(bind=engine)

origins = [
    'http://localhost:3000'
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")

# @app.get("/")
# def read_root():
#     return {"status": "Imobiliare API is running!"}

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db 
#     finally:
#         db.close()

# db_dependency = Depends(get_db)



# @app.get("/api/message")
# def get_message():
#     return {"message": "Olá do Backend FastAPI!"}

# @app.post("/api/register")
# async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):

#     db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email já registado")
#     db_user_cpf_check = db.query(models.User).filter(models.User.cpf == user_data.cpf).first()
#     if db_user_cpf_check:
#         raise HTTPException(status_code=400, detail="CPF já registado")


#     new_user = models.User(
#         firstName=user_data.firstName,
#         lastName=user_data.lastName,
#         cpf=user_data.cpf,
#         phone=user_data.phone,
#         email=user_data.email,
#         hashed_password=f"hashed_{user_data.password}", 
#         cep=user_data.cep,
#         street=user_data.street,
#         number=user_data.number,
#         complement=user_data.complement,
#         neighborhood=user_data.neighborhood,
#         city=user_data.city,
#         state=user_data.state
#     )

#     # 3. Adicionar à sessão e guardar na base de dados
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     print(f"Utilizador {new_user.email} guardado na base de dados com o ID: {new_user.id}")

#     return {"message": f"Utilizador {user_data.firstName} registado com sucesso!"}
