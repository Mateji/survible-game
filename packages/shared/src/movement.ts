export const PLAYER_MOVE_MESSAGE = "player:move";

export const WORLD_STATE_MESSAGE = "world:state";

export const DEFAULT_PLAYER_MOVE_SPEED = 160;

export const DEFAULT_SERVER_TICK_RATE = 20;

export const DEFAULT_PLAYER_RADIUS = 16;

export const PLAYER_COLOR_PALETTE = [
    "#66ff99",
    "#4fa3ff",
    "#ffd166",
    "#ff7f50",
    "#c77dff",
    "#06d6a0"
] as const;

export type PlayerColor = (typeof PLAYER_COLOR_PALETTE)[number];

export interface MoveInput {
    directionX: number;
    directionY: number;
    sequence?: number;
}

export interface PlayerInputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    sequence?: number;
}

export interface PlayerState {
    sessionId: string;
    position: {
        x: number;
        y: number;
    };
    color?: PlayerColor;
}

export type WorldState = Record<string, PlayerState>;