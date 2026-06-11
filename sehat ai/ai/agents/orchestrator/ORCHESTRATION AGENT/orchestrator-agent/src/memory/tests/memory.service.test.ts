import { MemoryService } from "../services/memory.service";
import { MemoryProvider } from "../interfaces/memory-provider.interface";

describe("MemoryService", () => {
  it("delegates get and set to provider", async () => {
    const provider: MemoryProvider<string> = {
      providerName: "in-memory",
      get: jest.fn().mockResolvedValue("value"),
      set: jest.fn().mockResolvedValue(true),
      delete: jest.fn().mockResolvedValue(true),
      exists: jest.fn().mockResolvedValue(true),
      expire: jest.fn().mockResolvedValue(true),
      clear: jest.fn().mockResolvedValue(undefined),
      healthCheck: jest.fn().mockResolvedValue({ provider: "in-memory", status: "healthy" }),
    };

    const service = new MemoryService(provider);
    expect(await service.get("key")).toBe("value");
    expect(provider.get).toHaveBeenCalledWith("key");
    expect(await service.set("key", "value")).toBe(true);
    expect(provider.set).toHaveBeenCalledWith("key", "value", undefined);
  });

  it("falls back to in-memory when redis provider is unhealthy", async () => {
    const provider: MemoryProvider<string> = {
      providerName: "redis",
      get: jest.fn().mockRejectedValue(new Error("connection failed")),
      set: jest.fn().mockRejectedValue(new Error("connection failed")),
      delete: jest.fn().mockRejectedValue(new Error("connection failed")),
      exists: jest.fn().mockRejectedValue(new Error("connection failed")),
      expire: jest.fn().mockRejectedValue(new Error("connection failed")),
      clear: jest.fn().mockRejectedValue(new Error("connection failed")),
      healthCheck: jest.fn().mockResolvedValue({ provider: "redis", status: "unhealthy", details: "timeout" }),
    };

    const service = new MemoryService(provider);
    const health = await service.healthCheck();

    expect(health.status).toBe("healthy");
    expect(health.provider).toBe("in-memory");
  });
});
