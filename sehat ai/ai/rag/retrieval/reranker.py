from typing import List, Dict

class ReRanker:
    def __init__(self):
        pass

    def rerank(self, query: str, candidates: List[Dict[str, any]]) -> List[Dict[str, any]]:
        return sorted(candidates, key=lambda item: item.get('score', 0), reverse=True)
