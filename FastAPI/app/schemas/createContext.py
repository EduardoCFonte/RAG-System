from pydantic import BaseModel
from fastapi import File
from . import user_register

class createContext(BaseModel):

    files:list
    email: str
    context: str