from fastapi import APIRouter
from .endpoints import users
from .endpoints import login
from .endpoints import receiver
from .endpoints import contexts

router = APIRouter()

router.include_router(users.router, tags=["Users"])
router.include_router(login.router, tags=["Login"])
router.include_router(receiver.router, tags=["Receiver"])
router.include_router(contexts.router, tags=["Contexts"])