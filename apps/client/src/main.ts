import Phaser from "phaser";
import { Client } from "@colyseus/sdk";
import { WORLD_ROOM_NAME } from "@survible/shared";

class MainScene extends Phaser.Scene {
    public constructor() {
        super("main");
    }

    public async create(): Promise<void> {
        this.add.text(20, 20, "Survible Client läuft", {
            color: "#ffffff"
        });

        const client = new Client("http://localhost:2567");

        try {
            const room = await client.joinOrCreate(WORLD_ROOM_NAME);
            this.add.text(20, 60, `Verbunden: ${room.sessionId}`, {
                color: "#00ff99"
            });
        } catch (error) {
            this.add.text(20, 60, "Server nicht erreichbar", {
                color: "#ff6666"
            });
            console.error(error);
        }
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