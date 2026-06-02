from typing import List, Dict

class SafetyPipeline:
    def __init__(self, threshold: float = 0.45):
        self.threshold = threshold

    def validate_retrieval(self, results: List[Dict[str, any]]) -> Dict[str, any]:
        if not results:
            return {'ok': False, 'reason': 'no_context'}

        low_confidence = [r for r in results if r.get('score', 0) < self.threshold]
        return {
            'ok': len(low_confidence) == 0,
            'lowConfidenceCount': len(low_confidence),
            'threshold': self.threshold,
        }

    def check_for_hallucination(self, content: str) -> bool:
        if not content:
            return True
        return False
