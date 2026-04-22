# Survible Game - Repository Instructions

## Project architecture
- This repository is a pnpm workspace monorepo.
- Workspace packages:
  - apps/client = browser client built with TypeScript, Vite, and Phaser
  - apps/server = multiplayer backend built with TypeScript, Node.js, Express, and Colyseus
  - packages/shared = shared contracts, constants, DTOs, and pure logic used by both client and server
- Prefer changes that preserve this separation of concerns.
- Do not move backend logic into the client.
- Do not duplicate shared types between client and server. Put shared contracts into packages/shared.

## Package management
- Use pnpm, never npm, for install and script commands in this repository.
- When adding dependencies, install them only in the relevant workspace package.
- Prefer commands like:
  - pnpm --filter @survible/client add <pkg>
  - pnpm --filter @survible/server add <pkg>
  - pnpm --filter @survible/shared add <pkg>
- For dev dependencies, prefer:
  - pnpm --filter <package-name> add -D <pkg>
- Do not suggest npm install, npx, yarn, or bun commands unless explicitly asked.

## TypeScript rules
- Use TypeScript everywhere.
- Prefer explicit types for exported APIs and shared contracts.
- Prefer clear names over short abbreviations.
- Use block statements, not terse one-liners.
- Keep functions small and focused.
- Prefer pure functions in shared logic when possible.

## Multiplayer architecture
- The server is authoritative.
- Never trust the client for inventory, crafting results, damage, resource gathering, cooldowns, or world state.
- The client may send input and intent, but the server owns the truth.
- Shared package may define message types and data shapes, but not browser-only or Node-only code.

## Client rules
- apps/client is browser-only code.
- Use Phaser for rendering and input.
- Keep UI and rendering concerns in the client.
- Do not put authoritative gameplay state in the client.
- Avoid Node.js APIs in client code.

## Server rules
- apps/server owns rooms, simulation, validation, and authoritative state.
- Use Colyseus rooms for multiplayer state and communication.
- Validate all client input on the server.
- Keep Express setup minimal and focused on bootstrapping and middleware.
- Avoid DOM or browser APIs in server code.

## Shared rules
- packages/shared contains shared constants, DTOs, message names, enums, helper types, and pure reusable logic.
- Shared code must stay runtime-neutral unless explicitly intended otherwise.
- Do not import Phaser, Express, Colyseus server internals, or browser globals into shared code.

## Code generation preferences
- When changing code, prefer minimal, targeted edits over large rewrites.
- Preserve existing naming and folder structure.
- When adding a new feature, update client, server, and shared only where needed.
- For new multiplayer features, propose the shared contract first, then server handling, then client usage.

## Output style
- When suggesting terminal commands, use pnpm workspace filter commands.
- When creating files, place them in the correct workspace package.
- Explain architectural decisions briefly when they affect client-server boundaries.