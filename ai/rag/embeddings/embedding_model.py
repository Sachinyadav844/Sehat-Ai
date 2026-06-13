import os
from typing import List
import openai

openai.api_key = os.getenv('OPENAI_API_KEY', '')

class EmbeddingModel:
    def __init__(self, model_name: str = 'text-embedding-3-large'):
        self.model_name = model_name

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []

        response = openai.Embedding.create(
            model=self.model_name,
            input=texts,
        )
        return [item.embedding for item in response.data]

    def embed_text(self, text: str) -> List[float]:
        return self.embed_texts([text])[0] if text else []
