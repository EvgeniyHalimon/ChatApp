import express, { NextFunction } from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import config from 'config'
import logger from './utils/logger'
import socket, { ISocket } from './socket'
import { randomUUID } from "crypto";

const port = process.env.SOCKET_URL_SERVER || 4000
const host = process.env.SOCKET_URL_SERVER || 'localhost'
const corsOrigin = config.get<string[]>("corsOrigin")

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true
    }
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
    logger.info(`🚀 Server is listening on port ${port} 🚀`)
})
