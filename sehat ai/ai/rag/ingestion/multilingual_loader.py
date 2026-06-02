from typing import Dict, List

class MultilingualLoader:
    def load(self, localized_documents: Dict[str, str]) -> List[str]:
        return [text for text in localized_documents.values() if text]
