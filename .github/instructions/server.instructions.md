---
applyTo: "apps/server/**/*"
---

# Server-specific Instructions

- This area is the authoritative multiplayer backend.
- Use TypeScript, Node.js, Express, and Colyseus.
- The server owns truth for player state, world state, inventory, crafting, gathering, and validation.
- Treat all client data as untrusted input.
- Keep Colyseus room code focused on simulation, validation, and state transitions.
- Prefer explicit handlers and clear validation paths.
- Use shared contracts from @survible/shared instead of redefining DTOs.
- Avoid browser APIs, DOM types, and client rendering concepts.
- Keep bootstrapping code separate from room logic.
- Prefer minimal middleware and clear startup code.