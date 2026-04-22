---
applyTo: "packages/shared/**/*"
---

# Shared-specific Instructions

- This package contains contracts shared by client and server.
- Prefer interfaces, type aliases, enums, constants, and pure utility functions.
- Keep this package framework-light and environment-neutral.
- Do not import Phaser, Express, or server-only/browser-only APIs here.
- Favor serializable data structures.
- Keep names stable and descriptive because these contracts define the client-server boundary.
- If a type is used on both sides, define it here once instead of duplicating it.