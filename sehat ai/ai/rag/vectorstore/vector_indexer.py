from typing import List, Dict, Optional
from .qdrant_client import QdrantVectorStore
from .chroma_client import ChromaVectorStore

class VectorIndexer:
    def __init__(self, provider: str = 'qdrant'):
        self.provider = provider.lower()
        if self.provider == 'qdrant':
            self.client = QdrantVectorStore()
        else:
            self.client = ChromaVectorStore()

    def index(self, documents: List[Dict[str, any]], embeddings: List[List[float]]):
        if self.provider == 'qdrant':
            points = []
            for doc, vector in zip(documents, embeddings):
                points.append({
                    'id': doc.get('id') or doc.get('source'),
                    'vector': vector,
                    'payload': {'content': doc.get('content'), 'source': doc.get('source')},
                })
            self.client.upsert(points)
        else:
            ids = [doc.get('id') or doc.get('source') for doc in documents]
            texts = [doc.get('content', '') for doc in documents]
            self.client.upsert(ids=ids, documents=texts, embeddings=embeddings, metadatas=[{'source': d.get('source')} for d in documents])
