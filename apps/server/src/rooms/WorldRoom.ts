import { Room, Client } from "colyseus";
import {
    DEFAULT_PLAYER_MOVE_SPEED,
    DEFAULT_SERVER_TICK_RATE,
    type PlayerInputState,
    PLAYER_COLOR_PALETTE,
    PLAYER_MOVE_MESSAGE,
    WORLD_STATE_MESSAGE,
    type WorldState
} from "@survible/shared";

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;
const PLAYER_RADIUS = 16;

export class WorldRoom extends Room {
    private worldState: WorldState = {};

    private latestInputBySessionId: Record<string, PlayerInputState> = {};

    public onCreate(): void {
        console.log("WorldRoom erstellt");

        this.onMessage<PlayerInputState>(PLAYER_MOVE_MESSAGE, (client, input) => {
            const sanitizedInput = this.sanitizeMoveInput(input);

            if (sanitizedInput === null) {
                return;
            }

            this.latestInputBySessionId[client.sessionId] = sanitizedInput;
        });

        this.setSimulationInterval((deltaTimeMs) => {
            this.tickMovement(deltaTimeMs);
            this.broadcastWorldState();
        }, 1000 / DEFAULT_SERVER_TICK_RATE);
    }

    public onJoin(client: Client): void {
        const spawnX = this.randomBetween(PLAYER_RADIUS, WORLD_WIDTH - PLAYER_RADIUS);
        const spawnY = this.randomBetween(PLAYER_RADIUS, WORLD_HEIGHT - PLAYER_RADIUS);

        this.worldState[client.sessionId] = {
            sessionId: client.sessionId,
            position: {
                x: spawnX,
                y: spawnY
            },
            color: this.getRandomColor()
        };

        this.latestInputBySessionId[client.sessionId] = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.broadcastWorldState();

        console.log(`Client joined: ${client.sessionId}`);
    }

    public onLeave(client: Client): void {
        delete this.worldState[client.sessionId];
        delete this.latestInputBySessionId[client.sessionId];

        this.broadcastWorldState();

        console.log(`Client left: ${client.sessionId}`);
    }

    private tickMovement(deltaTimeMs: number): void {
        const deltaTimeSeconds = deltaTimeMs / 1000;

        for (const player of Object.values(this.worldState)) {
            const input = this.latestInputBySessionId[player.sessionId] ?? {
                up: false,
                down: false,
                left: false,
                right: false
            };

            let directionX = 0;
            let directionY = 0;

            if (input.left && !input.right) {
                directionX = -1;
            }

            if (input.right && !input.left) {
                directionX = 1;
            }

            if (input.up && !input.down) {
                directionY = -1;
            }

            if (input.down && !input.up) {
                directionY = 1;
            }

            const length = Math.hypot(directionX, directionY);

            if (length > 1) {
                directionX /= length;
                directionY /= length;
            }

            player.position.x += directionX * DEFAULT_PLAYER_MOVE_SPEED * deltaTimeSeconds;
            player.position.y += directionY * DEFAULT_PLAYER_MOVE_SPEED * deltaTimeSeconds;

            player.position.x = Math.max(PLAYER_RADIUS, Math.min(WORLD_WIDTH - PLAYER_RADIUS, player.position.x));
            player.position.y = Math.max(PLAYER_RADIUS, Math.min(WORLD_HEIGHT - PLAYER_RADIUS, player.position.y));
        }
    }

    private sanitizeMoveInput(input: PlayerInputState): PlayerInputState | null {
        if (
            typeof input.up !== "boolean"
            || typeof input.down !== "boolean"
            || typeof input.left !== "boolean"
            || typeof input.right !== "boolean"
        ) {
            return null;
        }

        return {
            up: input.up,
            down: input.down,
            left: input.left,
            right: input.right,
            sequence: input.sequence
        };
    }

    private broadcastWorldState(): void {
        this.broadcast(WORLD_STATE_MESSAGE, this.worldState);
    }

    private getRandomColor() {
        const index = Math.floor(Math.random() * PLAYER_COLOR_PALETTE.length);
        return PLAYER_COLOR_PALETTE[index];
    }

    private randomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}