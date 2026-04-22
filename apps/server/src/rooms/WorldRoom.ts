import { Room, Client } from "colyseus";

export class WorldRoom extends Room {
    public onCreate(): void {
        console.log("WorldRoom erstellt");
    }

    public onJoin(client: Client): void {
        console.log(`Client joined: ${client.sessionId}`);
    }

    public onLeave(client: Client): void {
        console.log(`Client left: ${client.sessionId}`);
    }
}