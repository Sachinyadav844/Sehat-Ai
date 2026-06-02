# Database Layer

This folder contains SehatAI's production-ready database architecture for PostgreSQL, Prisma, Redis, and seed data.

## Structure

- `postgres/`
  - `extensions.sql` — required PostgreSQL extensions for pgvector and UUID support
  - `init.sql` — database bootstrap script
- `prisma/`
  - `schema.prisma` — PostgreSQL data model with user, consultation, agent memory, report, appointment, hospital, emergency, doctor, and disease tables
- `redis/`
  - `redis.config.ts` — Redis client configuration for caching, sessions, and pub/sub
- `schemas/`
  - JSON schema definitions for validation of database entities
- `seed/`
  - seed data for hospitals, doctors, and diseases
  - `seed.ts` — seed loader implementation

## Usage

1. Set `DATABASE_URL` in your environment.
2. Run Prisma migrations or `prisma db push`.
3. Run `pnpm prisma generate --schema database/prisma/schema.prisma`.
4. Run `pnpm ts-node database/seed/seed.ts` to populate master data.
