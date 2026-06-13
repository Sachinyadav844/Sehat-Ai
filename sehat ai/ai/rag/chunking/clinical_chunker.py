from typing import List

class ClinicalChunker:
    def chunk(self, clinical_text: str, chunk_size: int = 600) -> List[str]:
        return [clinical_text[i:i+chunk_size] for i in range(0, len(clinical_text), chunk_size)]
