import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { WorldRoom } from "./rooms/WorldRoom";
import { WORLD_ROOM_NAME } from "@survible/shared";

const port = Number(process.env.PORT ?? 2567);

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/colyseus", monitor());

const server = http.createServer(app);

const gameServer = new Server({
    server
});

gameServer.define(WORLD_ROOM_NAME, WorldRoom);

gameServer.listen(port);

console.log(`Server läuft auf http://localhost:${port}`);