from typing import Any, Dict, List
from ..embeddings.embedding_model import EmbeddingModel
from ..vectorstore.qdrant_client import QdrantVectorStore

class MedicalRetriever:
    def __init__(self, model_name: str = 'BAAI/bge-large-en'):
        self.embedder = EmbeddingModel(model_name=model_name)
        self.store = QdrantVectorStore()

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        vector = self.embedder.embed_text(query)
        raw_results = self.store.search(vector, limit=top_k)
        return [self._format_hit(hit) for hit in raw_results]

    def _format_hit(self, hit: Any) -> Dict[str, Any]:
        payload = getattr(hit, 'payload', {})
        return {
            'id': getattr(hit, 'id', None),
            'score': getattr(hit, 'score', None),
            'content': payload.get('content') if isinstance(payload, dict) else None,
            'source': payload.get('source') if isinstance(payload, dict) else None,
        }
