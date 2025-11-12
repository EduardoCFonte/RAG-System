import fitz 
import sys
from fastapi import File, UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from app.core.ml_model import ml_models
from app.core.load_env import settings

class pdf_parser:
    def __init__(self):
        self.embeddings_model = ml_models.get("embeddings_model")
        if self.embeddings_model is None:
            raise RuntimeError("Embedding model not .")
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=2200,
                                                  chunk_overlap=50,
                                                  length_function=len,
                                                  separators=["Art.","\n\n", "\n", ". ", " ", ""])
        self.vector_store = Chroma(
            persist_directory=settings.CHROMA_DB_PATH,
            embedding_function=self.embeddings_model 
        )
    
    async def read_pdf(self, files: list[UploadFile] = File(...)):

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

        self.vector_store.add_texts(texts=all_chunks)

        print("Documentos processados e armazenados.")
        return
    
    def chunk_op(self, complete_pdf: list):
        chunks = self.splitter.split_text(complete_pdf)
        return chunks