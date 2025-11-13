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

from .core.ml_model import ml_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("A iniciar a aplicação...")

    yield
    print("tchau")


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
