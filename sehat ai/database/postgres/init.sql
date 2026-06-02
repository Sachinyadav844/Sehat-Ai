-- Initialize the SehatAI PostgreSQL database
-- Run this script as a superuser or via psql with sufficient privileges.

CREATE DATABASE sehat_ai;
\c sehat_ai;

-- Load required extensions
\i extensions.sql

-- Additional schema initialization can be run via Prisma migrations.
