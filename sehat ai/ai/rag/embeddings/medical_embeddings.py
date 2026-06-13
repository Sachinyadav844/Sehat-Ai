from .embedding_model import EmbeddingModel

class MedicalEmbeddingModel(EmbeddingModel):
    def __init__(self, model_name: str = 'BAAI/bge-large-en'):
        super().__init__(model_name=model_name)

    def embed_medical_texts(self, texts):
        return self.embed_texts(texts)

    def embed_medical_text(self, text):
        return self.embed_text(text)
