---
applyTo: "apps/client/**/*"
---

# Client-specific Instructions

- This area is the browser game client.
- Use TypeScript, Vite, and Phaser.
- Prefer Phaser scenes, game objects, and clear update flows.
- Keep rendering, input collection, camera behavior, and local UI in the client.
- Do not implement authoritative gameplay logic here.
- Do not calculate trusted inventory, crafting success, damage, or resource ownership on the client.
- Prefer imports from @survible/shared for shared contracts and constants.
- Avoid server-only packages and Node.js built-ins.
- When networking is needed, keep the client thin: send intent, receive synchronized state.
- Prefer simple, readable scene code over clever abstractions.
- For prototypes, keep assets and bootstrapping lightweight.