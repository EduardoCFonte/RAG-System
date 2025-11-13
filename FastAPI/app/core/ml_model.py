from langchain_huggingface import HuggingFaceEmbeddings
import nltk

class ml_models:

    def __init__(self):
        nltk.download('punkt')
        print("A carregar o modelo de embedding (ex: 'all-MiniLM-L6-v2')...")
        self.embedded_models = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs = {'device': 'cuda'} 
        )
    


    