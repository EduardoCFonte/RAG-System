from pydantic import BaseModel

class ChatRequest(BaseModel):
    context_name: str
    question: str