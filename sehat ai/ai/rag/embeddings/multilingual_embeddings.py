from .embedding_model import EmbeddingModel

class MultilingualEmbeddingModel(EmbeddingModel):
    def __init__(self, model_name: str = 'multilingual-e5-large'):
        super().__init__(model_name=model_name)

    def embed_multilingual_texts(self, texts):
        return self.embed_texts(texts)

    def embed_multilingual_text(self, text):
        return self.embed_text(text)
