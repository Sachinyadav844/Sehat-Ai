import { Logger } from "../shared/logger";

export interface ExecutionOptions {
  timeoutMs?: number;
  retries?: number;
}

export class ExecutionEngine {
  async runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
    });

    return Promise.race([promise, timeout]) as Promise<T>;
  }

  async runWithRetry<T>(factory: () => Promise<T>, retries = 2): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await factory();
      } catch (error) {
        lastError = error;
        Logger.warn(`Retry attempt ${attempt + 1} failed: ${(error as Error).message}`, "ExecutionEngine");
      }
    }
    throw lastError;
  }

  async execute<T>(factory: () => Promise<T>, options: ExecutionOptions = {}): Promise<T> {
    const run = async () => {
      if (options.timeoutMs) {
        return await this.runWithTimeout(factory(), options.timeoutMs);
      }
      return await factory();
    };

    if (options.retries && options.retries > 0) {
      return await this.runWithRetry(run, options.retries);
    }
    return await run();
  }
}
