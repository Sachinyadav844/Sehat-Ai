from .hybrid_search import HybridSearch

class EmergencyRetrieval:
    def __init__(self):
        self.searcher = HybridSearch()

    def retrieve_emergency_context(self, query: str, top_k: int = 5):
        return self.searcher.search(query, top_k=top_k, emergency=True)
