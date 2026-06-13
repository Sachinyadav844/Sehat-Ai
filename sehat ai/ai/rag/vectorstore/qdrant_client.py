import os
from typing import Any, Dict, List, Optional

try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models as rest
except ImportError:
    QdrantClient = None
    rest = None

class QdrantVectorStore:
    def __init__(self, collection_name: str = 'sehat_medical', host: Optional[str] = None, port: Optional[int] = None):
        self.collection_name = collection_name
        self.host = host or os.getenv('QDRANT_HOST', 'localhost')
        self.port = port or int(os.getenv('QDRANT_PORT', '6333'))
        if QdrantClient is None:
            raise RuntimeError('qdrant-client is not installed. Install qdrant-client to enable vector storage.')
        self.client = QdrantClient(url=f'http://{self.host}:{self.port}')
        self._ensure_collection()

    def _ensure_collection(self):
        if self.collection_name not in [col.name for col in self.client.get_collections().collections]:
            self.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=rest.VectorParams(size=1536, distance=rest.Distance.COSINE),
            )

    def upsert(self, points: List[Dict[str, Any]]):
        self.client.upsert(
            collection_name=self.collection_name,
            points=[rest.PointStruct(id=point['id'], vector=point['vector'], payload=point.get('payload')) for point in points],
        )

    def search(self, vector: List[float], limit: int = 10, query: Optional[Dict[str, Any]] = None):
        return self.client.search(
            collection_name=self.collection_name,
            query_vector=vector,
            limit=limit,
            query_filter=query,
        )
