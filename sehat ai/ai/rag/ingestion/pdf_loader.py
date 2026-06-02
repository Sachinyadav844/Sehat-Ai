import os
from typing import List

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

class PDFLoader:
    def load(self, file_path: str) -> List[str]:
        if PyPDF2 is None:
            raise RuntimeError('PyPDF2 not installed. Install PyPDF2 for PDF ingestion.')
        if not os.path.exists(file_path):
            return []
        text_pages = []
        with open(file_path, 'rb') as f:
            pdf = PyPDF2.PdfReader(f)
            for page in pdf.pages:
                text_pages.append(page.extract_text() or '')
        return text_pages
