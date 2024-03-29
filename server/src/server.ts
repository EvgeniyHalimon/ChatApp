import express, { NextFunction } from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import socket, { ISocket } from './socket'
import { randomUUID } from "crypto";

const port = "http://localhost:4000"

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ["*", "http://localhost:4000"],
        credentials: true
    }
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ["*", "http://localhost:4000"]);
    next();
  });

io.use(async (socket: any, next) => {
    const username = socket.handshake.auth.value;
    console.log("🚀 ~ file: server.ts:26 ~ io.use ~ username:", username)

    if (!username) {
        return next(new Error("invalid username!"));
    }

    socket.userID = randomUUID();
    socket.username = username;
    next();
});

app.get('/', (_, res) => {
    res.send("Server is up")
})

socket({io})
httpServer.listen(port, () => {

})
