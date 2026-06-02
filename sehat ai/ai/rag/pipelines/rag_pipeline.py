from typing import List, Dict, Optional
from ..retrieval.hybrid_search import HybridSearch
from ..retrieval.emergency_retrieval import EmergencyRetrieval
from ..pipelines.safety_pipeline import SafetyPipeline
from ..pipelines.multilingual_pipeline import MultilingualPipeline

class RAGPipeline:
    def __init__(self):
        self.searcher = HybridSearch()
        self.emergency_searcher = EmergencyRetrieval()
        self.safety = SafetyPipeline()
        self.multilingual = MultilingualPipeline()

    def retrieve_context(self, query: str, language: str = 'en', emergency: bool = False) -> Dict[str, List[Dict[str, any]]]:
        if emergency:
            results = self.emergency_searcher.retrieve_emergency_context(query)
        else:
            results = self.searcher.search(query)

        localized = self.multilingual.translate_context(results, language)
        validation = self.safety.validate_retrieval(results)

        return {
            'query': query,
            'language': language,
            'results': localized,
            'validation': validation,
        }

    def store_documents(self, documents: List[Dict[str, any]]):
        # noop: placeholder for ingestion pipeline
        return len(documents)
