import os
from typing import Any, Dict, List, Optional

try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    chromadb = None

class ChromaVectorStore:
    def __init__(self, collection_name: str = 'sehat_medical'):
        if chromadb is None:
            raise RuntimeError('chromadb is not installed. Install chromadb to enable vector storage.')
        self.client = chromadb.Client(Settings(chroma_db_impl='duckdb+parquet', persist_directory=os.getenv('CHROMA_PERSIST_DIR', 'chromadb_store')))
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def upsert(self, ids: List[str], documents: List[str], embeddings: List[List[float]], metadatas: Optional[List[Dict[str, Any]]] = None):
        self.collection.upsert(ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas)

    def query(self, query_texts: List[str], n_results: int = 10, query_embeddings: Optional[List[List[float]]] = None):
        return self.collection.query(query_texts=query_texts, query_embeddings=query_embeddings, n_results=n_results)
