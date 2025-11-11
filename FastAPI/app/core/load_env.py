from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    ALGORITHM:str
    SECRET_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES: int=30
    CHROMA_DB_PATH: str


    class Config:
        env_file = ".env"

settings = Settings()

