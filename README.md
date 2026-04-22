# Survible Game

Ein browserbasiertes 2D-Multiplayer-Survival-Crafting-Projekt auf Basis eines pnpm-Monorepos.

Der aktuelle Stack:

- **Client:** TypeScript, Vite, Phaser
- **Server:** TypeScript, Node.js, Express, Colyseus
- **Shared:** gemeinsame Typen, Konstanten und Contracts für Client und Server

## Projektstruktur

```text
survible-game/
├── apps/
│   ├── client/      # Browser-Client mit Phaser + Vite
│   └── server/      # Multiplayer-Backend mit Colyseus
├── packages/
│   └── shared/      # Gemeinsame Typen, DTOs, Konstanten
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
