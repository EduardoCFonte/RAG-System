from app.core.load_env import settings
import os

def GetChromaContext(email:str):
    ContextNames = []
    path_user = os.path.join(settings.CHROMA_DB_PATH,email)
    if not os.path.exists(path_user):
        return ContextNames
    if os.path.isdir(path_user):
        all_items = os.listdir(path_user)
        for item in all_items:
            if(os.path.isdir(os.path.join(path_user,item))):
                ContextNames.append(item)

    return ContextNames