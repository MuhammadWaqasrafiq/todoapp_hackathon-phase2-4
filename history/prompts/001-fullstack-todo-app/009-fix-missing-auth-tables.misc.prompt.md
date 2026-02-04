---
id: "009"
title: "Fix Missing Auth Tables"
stage: "misc"
date: "2025-12-31"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "fullstack-todo-app"
branch: "main"
user: "DevAbdullah90"
command: "fix-auth-migration"
labels:
  - "better-auth"
  - "postgres"
  - "migration"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/package.json"
tests: []
---

# Prompt

my frontend is giving this error when i am tring to registering an account:
POST /api/auth/sign-up/email 500
ERROR [Better Auth]: relation "user" does not exist

# Response

The error was caused by missing database tables (`user`, `session`, etc.) required by `better-auth`. The `better-auth` CLI was unable to connect to the database because it wasn't loading the `DATABASE_URL` from `.env.local`.

I fixed this by:
1.  Running the migration using `npx dotenv-cli -e .env.local -- npx @better-auth/cli migrate`, which successfully created the missing tables.
2.  Installing `dotenv-cli` as a dev dependency.
3.  Adding a `db:migrate` script to `frontend/package.json` so you can easily run migrations in the future with `npm run db:migrate`.

You should now be able to register an account without the "relation does not exist" error.
