export interface Position {
    x: number;
    y: number;
}

export interface PlayerSnapshot {
    sessionId: string;
    name: string;
    position: Position;
}

export const WORLD_ROOM_NAME = "world";

export * from "./movement";