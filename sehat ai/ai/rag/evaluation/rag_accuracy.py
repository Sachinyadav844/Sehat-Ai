from typing import List, Dict

class RAGAccuracy:
    def evaluate(self, predicted: List[Dict[str, any]], expected: List[Dict[str, any]]) -> float:
        if not expected:
            return 0.0
        match_count = sum(1 for p in predicted if any(e['id'] == p.get('id') for e in expected))
        return match_count / len(expected)
