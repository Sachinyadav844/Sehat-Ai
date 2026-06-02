from typing import List

class EmergencyChunker:
    def chunk(self, text: str, top_priority_terms: int = 5) -> List[str]:
        terms = ['chest pain', 'shortness of breath', 'bleeding', 'unconscious', 'severe headache', 'vomiting']
        chunks = []
        lower_text = text.lower()
        for term in terms:
            if term in lower_text:
                start = max(lower_text.index(term) - 120, 0)
                end = min(start + 320, len(text))
                chunks.append(text[start:end])
        if not chunks and text:
            chunks = [text[:320]]
        return chunks
