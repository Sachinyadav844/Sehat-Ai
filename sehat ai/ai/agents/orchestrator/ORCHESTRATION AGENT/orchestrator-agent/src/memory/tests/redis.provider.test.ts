import { RedisProvider } from "../providers/redis.provider";

describe("RedisProvider", () => {
  let provider: RedisProvider<{ foo: number }>;

  beforeEach(() => {
    provider = new RedisProvider({ host: "localhost", port: 6379, keyPrefix: "test:" });
  });

  it("serializes and deserializes JSON values", async () => {
    (provider as any).client = {
      status: "ready",
      get: jest.fn().mockResolvedValue('{"foo":42}'),
      set: jest.fn().mockResolvedValue("OK"),
      exists: jest.fn().mockResolvedValue(1),
      del: jest.fn().mockResolvedValue(1),
      expire: jest.fn().mockResolvedValue(1),
      ping: jest.fn().mockResolvedValue("PONG"),
    };

    const actual = await provider.get("payload");
    expect(actual).toEqual({ foo: 42 });
    expect((provider as any).client.get).toHaveBeenCalledWith("test:payload");
  });

  it("returns null for missing keys", async () => {
    (provider as any).client = {
      status: "ready",
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
      exists: jest.fn().mockResolvedValue(0),
      del: jest.fn().mockResolvedValue(0),
      expire: jest.fn().mockResolvedValue(0),
      ping: jest.fn().mockResolvedValue("PONG"),
    };

    expect(await provider.get("missing")).toBeNull();
  });

  it("honors exists and expire commands", async () => {
    (provider as any).client = {
      status: "ready",
      get: jest.fn().mockResolvedValue('{"foo":0}'),
      set: jest.fn().mockResolvedValue("OK"),
      exists: jest.fn().mockResolvedValue(1),
      del: jest.fn().mockResolvedValue(1),
      expire: jest.fn().mockResolvedValue(1),
      ping: jest.fn().mockResolvedValue("PONG"),
    };

    expect(await provider.exists("exists:key")).toBe(true);
    expect(await provider.expire("exists:key", 10)).toBe(true);
  });

  it("reports healthy status when ping succeeds", async () => {
    (provider as any).client = {
      status: "ready",
      ping: jest.fn().mockResolvedValue("PONG"),
    };

    const health = await provider.healthCheck();
    expect(health.status).toBe("healthy");
    expect(health.provider).toBe("redis");
  });
});
