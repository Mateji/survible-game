import Phaser from "phaser";
import { Client, Room } from "@colyseus/sdk";
import {
    DEFAULT_PLAYER_RADIUS,
    type PlayerInputState,
    PLAYER_MOVE_MESSAGE,
    type PlayerState,
    WORLD_STATE_MESSAGE,
    WORLD_ROOM_NAME,
    type WorldState
} from "@survible/shared";

interface PlayerRenderState {
    circle: Phaser.GameObjects.Arc;
    targetX: number;
    targetY: number;
}

const INTERPOLATION_SPEED = 12;

class MainScene extends Phaser.Scene {
    private room: Room | null = null;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    private wasdKeys: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    } | null = null;

    private playerRenderStateBySessionId: Record<string, PlayerRenderState> = {};

    public constructor() {
        super("main");
    }

    public async create(): Promise<void> {
        this.add.text(20, 20, "Survible Client läuft", {
            color: "#ffffff"
        });

        const client = new Client("http://localhost:2567");
        const keyboard = this.input.keyboard;
        this.cursors = keyboard?.createCursorKeys() ?? null;
        this.wasdKeys = keyboard
            ? {
                w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            }
            : null;

        try {
            const room = await client.joinOrCreate(WORLD_ROOM_NAME);
            this.room = room;

            this.add.text(20, 60, `Verbunden: ${room.sessionId}`, {
                color: "#00ff99"
            });

            room.onMessage<WorldState>(WORLD_STATE_MESSAGE, (worldState) => {
                this.applyWorldState(worldState);
            });

            room.onLeave(() => {
                this.room = null;
            });
        } catch (error) {
            this.add.text(20, 60, "Server nicht erreichbar", {
                color: "#ff6666"
            });
            console.error(error);
        }
    }

    public update(_time: number, delta: number): void {
        if (!this.room || !this.cursors || !this.wasdKeys) {
            return;
        }

        const inputState: PlayerInputState = {
            up: this.cursors.up.isDown || this.wasdKeys.w.isDown,
            down: this.cursors.down.isDown || this.wasdKeys.s.isDown,
            left: this.cursors.left.isDown || this.wasdKeys.a.isDown,
            right: this.cursors.right.isDown || this.wasdKeys.d.isDown
        };

        this.room.send(PLAYER_MOVE_MESSAGE, inputState);

        const interpolationAlpha = Math.min(1, (delta / 1000) * INTERPOLATION_SPEED);

        for (const renderState of Object.values(this.playerRenderStateBySessionId)) {
            const interpolatedX = Phaser.Math.Linear(renderState.circle.x, renderState.targetX, interpolationAlpha);
            const interpolatedY = Phaser.Math.Linear(renderState.circle.y, renderState.targetY, interpolationAlpha);
            renderState.circle.setPosition(interpolatedX, interpolatedY);
        }
    }

    private applyWorldState(worldState: WorldState): void {
        const activeSessionIds = new Set(Object.keys(worldState));

        for (const [sessionId, playerState] of Object.entries(worldState)) {
            this.updatePlayerCircle(sessionId, playerState);
        }

        for (const [sessionId, renderState] of Object.entries(this.playerRenderStateBySessionId)) {
            if (!activeSessionIds.has(sessionId)) {
                renderState.circle.destroy();
                delete this.playerRenderStateBySessionId[sessionId];
            }
        }
    }

    private updatePlayerCircle(sessionId: string, playerState: PlayerState): void {
        let renderState = this.playerRenderStateBySessionId[sessionId];

        if (!renderState) {
            const playerCircle = this.add.circle(
                playerState.position.x,
                playerState.position.y,
                DEFAULT_PLAYER_RADIUS,
                this.resolvePlayerColor(playerState)
            );

            renderState = {
                circle: playerCircle,
                targetX: playerState.position.x,
                targetY: playerState.position.y
            };

            this.playerRenderStateBySessionId[sessionId] = renderState;
        }

        renderState.targetX = playerState.position.x;
        renderState.targetY = playerState.position.y;
        renderState.circle.setFillStyle(this.resolvePlayerColor(playerState));
    }

    private resolvePlayerColor(playerState: PlayerState): number {
        const color = playerState.color;

        if (!color) {
            return 0x66ff99;
        }

        const parsedColor = Number.parseInt(color.replace("#", ""), 16);

        if (Number.isNaN(parsedColor)) {
            return 0x66ff99;
        }

        return parsedColor;
    }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "#1a1a1a",
    parent: "app",
    scene: [MainScene]
};

new Phaser.Game(gameConfig);