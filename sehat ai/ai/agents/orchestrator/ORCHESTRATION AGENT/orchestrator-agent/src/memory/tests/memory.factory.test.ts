import { MemoryFactory } from "../factory/memory.factory";
import { InMemoryProvider } from "../providers/in-memory.provider";

describe("MemoryFactory", () => {
  const originalMemoryProvider = process.env.MEMORY_PROVIDER;
  const originalRedisEnabled = process.env.REDIS_ENABLED;

  afterEach(() => {
    process.env.MEMORY_PROVIDER = originalMemoryProvider;
    process.env.REDIS_ENABLED = originalRedisEnabled;
  });

  it("uses in-memory provider when MEMORY_PROVIDER is in-memory", () => {
    process.env.MEMORY_PROVIDER = "in-memory";

    const provider = MemoryFactory.create();
    expect(provider).toBeInstanceOf(InMemoryProvider);
    expect(provider.providerName).toBe("in-memory");
  });

  it("selects redis provider when REDIS_ENABLED is true and MEMORY_PROVIDER is not set", () => {
    process.env.MEMORY_PROVIDER = "";
    process.env.REDIS_ENABLED = "true";

    const provider = MemoryFactory.create();
    expect(provider.providerName).toBe("redis");
  });
});
