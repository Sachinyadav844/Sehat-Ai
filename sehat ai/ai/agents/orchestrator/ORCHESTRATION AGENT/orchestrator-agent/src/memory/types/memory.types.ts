export type MemoryKey = string;

export interface MemoryMetadata {
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export type MemoryProviderName = "in-memory" | "redis";

export interface MemoryHealthReport {
  provider: MemoryProviderName;
  status: "healthy" | "unhealthy";
  details?: string;
}

export class MemoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MemoryError";
  }
}

export class MemoryValidationError extends MemoryError {
  constructor(message: string) {
    super(message);
    this.name = "MemoryValidationError";
  }
}

export class MemoryProviderError extends MemoryError {
  constructor(message: string) {
    super(message);
    this.name = "MemoryProviderError";
  }
}
