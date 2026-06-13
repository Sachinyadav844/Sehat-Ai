export type EmbeddingVector = number[];

export const EMBEDDING_MODELS = {
  BGE: "BAAI/bge-large-en-v1.5",
  MULTILINGUAL: "multilingual-e5-large",
  INSTRUCTOR: "instructor-xl"
} as const;

export type EmbeddingModel = (typeof EMBEDDING_MODELS)[keyof typeof EMBEDDING_MODELS];
