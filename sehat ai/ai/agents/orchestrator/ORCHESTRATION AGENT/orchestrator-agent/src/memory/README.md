# Memory Provider Layer

This module provides a pluggable memory provider architecture for the SehatAI Orchestrator Agent.

## Architecture

- `MemoryProvider` interface defines the contract for all memory backends.
- `InMemoryProvider` is the default provider and supports TTL, cleanup, expiration checks, and safe payload validation.
- `RedisProvider` is a scaffolded provider for future Redis deployment and supports JSON serialization, TTL, health checks, and connection handling.
- `MemoryFactory` selects the provider based on environment variables.
- `MemoryService` wraps the selected provider and performs fallback to in-memory when Redis becomes unavailable.

## Provider Selection

The provider is selected by environment variables:

- `MEMORY_PROVIDER=in-memory`
- `MEMORY_PROVIDER=redis`
- `REDIS_ENABLED=true`

If Redis is enabled but cannot be reached, the system automatically falls back to `InMemoryProvider`.

## Environment Variables

- `REDIS_ENABLED=false`
- `REDIS_HOST=localhost`
- `REDIS_PORT=6379`
- `REDIS_PASSWORD=`
- `REDIS_DB=0`
- `REDIS_KEY_PREFIX=sehatai:`
- `MEMORY_PROVIDER=in-memory`
- `LOG_LEVEL=info`

## Usage Example

```ts
import { createMemoryService } from "../memory";

const memoryService = createMemoryService();
await memoryService.set("session:abc", { userId: "u1" }, 120);
const result = await memoryService.get("session:abc");
```

## Fallback Strategy

The `MemoryService` is responsible for detecting Redis failures and switching to `InMemoryProvider` automatically. This ensures the orchestrator continues running without crashing.

## Future Redis Deployment Guide

1. Install Redis and ensure it is reachable from the orchestrator host.
2. Set the environment variables:
   - `REDIS_ENABLED=true`
   - `REDIS_HOST=<redis-host>`
   - `REDIS_PORT=<redis-port>`
   - `REDIS_PASSWORD=<redis-password>` if needed
3. Start the orchestrator.
4. Monitor logs for `memory.provider.connected` or `memory.fallback.activated` events.
