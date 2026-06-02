from typing import List

class SemanticChunker:
    def chunk(self, text: str, chunk_size: int = 800) -> List[str]:
        if not text:
            return []
        words = text.split()
        chunks = []
        current = []
        count = 0
        for word in words:
            current.append(word)
            count += 1
            if count >= chunk_size:
                chunks.append(' '.join(current))
                current = []
                count = 0
        if current:
            chunks.append(' '.join(current))
        return chunks
