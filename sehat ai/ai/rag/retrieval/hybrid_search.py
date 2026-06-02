from typing import List, Dict
from .retriever import MedicalRetriever

class HybridSearch:
    def __init__(self):
        self.retriever = MedicalRetriever()

    def search(self, query: str, top_k: int = 5, emergency: bool = False) -> List[Dict[str, any]]:
        docs = self.retriever.retrieve(query, top_k=top_k)
        if emergency:
            docs = sorted(docs, key=lambda d: d.get('score', 0), reverse=True)
        return docs

    def rerank(self, query: str, docs: List[Dict[str, any]]) -> List[Dict[str, any]]:
        return sorted(docs, key=lambda d: d.get('score', 0), reverse=True)
