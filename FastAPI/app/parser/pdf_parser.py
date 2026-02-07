import fitz 
import sys
from fastapi import File, UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from app.core.ml_model import ml_models
from app.core.load_env import settings
import os

class pdf_parser(ml_models):
    def __init__(self):
        super().__init__() 
        self.state = {}
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=2200,
                                                  chunk_overlap=50,
                                                  length_function=len,
                                                  separators=["Art.","\n\n", "\n", ". ", " ", ""])
    
    async def read_pdf(self, email: str, context:str, files: list[UploadFile] = File(...)):
    
        vector_store = self._get_vector_store(email,context)
        all_chunks = []

        for file in files:
            try:
                file_bytes = await file.read()
                doc = fitz.open(stream=file_bytes, filetype="pdf")
            except Exception as e:
                print("Erro para abrir o PDF")
                continue

            full_pdf = []

            for page in doc:
                text = page.get_text()
                full_pdf.append(text) 

            print("trying")
            doc.close()
            complete_pdf = "\n".join(full_pdf)
            all_chunks.extend(self.chunk_op(complete_pdf))

        if not all_chunks:
            print("Nenhum chunk de texto foi gerado.")
            return

        vector_store.add_texts(texts=all_chunks)

        print("Documentos processados e armazenados.")
        return
    
    def chunk_op(self, complete_pdf: list):
        chunks = self.splitter.split_text(complete_pdf)
        return chunks
    
    def _get_vector_store(self, email:str, context:str):
        pasta_email = os.path.join(settings.CHROMA_DB_PATH, email,context)
        if(os.path.exists(pasta_email)):
            print("Ja existe")
        vector_store = Chroma(
            persist_directory=pasta_email,
            embedding_function=self.embedded_models
        )
        return vector_store

parser = pdf_parser()