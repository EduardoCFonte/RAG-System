import fitz 
import sys
from fastapi import File, UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
import nltk
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_huggingface import HuggingFaceEmbeddings


class pdf_parser:
    def __init__(self):
        print("oi")
    
    async def read_pdf(self, files: list[UploadFile] = File(...)):
        
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
            self.chunk_op(complete_pdf)

        return complete_pdf
    
    def chunk_op(self, complete_pdf: list):
        splitter = RecursiveCharacterTextSplitter(chunk_size=2200,
                                                  chunk_overlap=50,
                                                  length_function=len,
                                                  separators=["Art.","\n\n", "\n", ". ", " ", ""])
        
        chunks = splitter.split_text(complete_pdf)
        return chunks