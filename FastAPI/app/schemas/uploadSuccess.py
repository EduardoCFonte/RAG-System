from pydantic import BaseModel

class UploadSuccess(BaseModel):
    status: str
    message: str
    context: str
    files_count: int