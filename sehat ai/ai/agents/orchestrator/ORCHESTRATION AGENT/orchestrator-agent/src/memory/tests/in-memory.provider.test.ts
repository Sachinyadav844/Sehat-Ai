import { InMemoryProvider } from "../providers/in-memory.provider";

describe("InMemoryProvider", () => {
  let provider: InMemoryProvider<unknown>;

  beforeEach(() => {
    provider = new InMemoryProvider();
  });

  afterEach(async () => {
    await provider.clear();
  });

  it("stores and retrieves values", async () => {
    await provider.set("patient:123", { name: "Test" });
    const result = await provider.get("patient:123");

    expect(result).toEqual({ name: "Test" });
  });

  it("deletes values", async () => {
    await provider.set("key:remove", 42);
    const deleted = await provider.delete("key:remove");
    const result = await provider.get("key:remove");

    expect(deleted).toBe(true);
    expect(result).toBeNull();
  });

  it("checks existence", async () => {
    await provider.set("exists:key", "value");
    expect(await provider.exists("exists:key")).toBe(true);
    await provider.delete("exists:key");
    expect(await provider.exists("exists:key")).toBe(false);
  });

  it("expires keys with TTL", async () => {
    await provider.set("ttl:key", "value", 1);
    expect(await provider.exists("ttl:key")).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(await provider.get("ttl:key")).toBeNull();
    expect(await provider.exists("ttl:key")).toBe(false);
  });

  it("updates TTL with expire", async () => {
    await provider.set("expire:key", "value", 1);
    const extended = await provider.expire("expire:key", 2);

    expect(extended).toBe(true);
    expect(await provider.exists("expire:key")).toBe(true);
  });

  it("clears all entries", async () => {
    await provider.set("clear:one", { value: 1 });
    await provider.set("clear:two", { value: 2 });
    await provider.clear();

    expect(await provider.exists("clear:one")).toBe(false);
    expect(await provider.exists("clear:two")).toBe(false);
  });
});
