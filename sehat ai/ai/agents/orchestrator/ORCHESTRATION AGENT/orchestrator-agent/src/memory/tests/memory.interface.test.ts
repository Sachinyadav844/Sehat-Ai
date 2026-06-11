import { InMemoryProvider } from "../providers/in-memory.provider";
import { MemoryProvider } from "../interfaces/memory-provider.interface";

describe("MemoryProvider interface", () => {
  it("should expose the provider contract", () => {
    const provider: MemoryProvider<unknown> = new InMemoryProvider();

    expect(provider).toHaveProperty("get");
    expect(provider).toHaveProperty("set");
    expect(provider).toHaveProperty("delete");
    expect(provider).toHaveProperty("exists");
    expect(provider).toHaveProperty("expire");
    expect(provider).toHaveProperty("clear");
    expect(provider).toHaveProperty("healthCheck");
    expect(provider.providerName).toBe("in-memory");
  });
});
