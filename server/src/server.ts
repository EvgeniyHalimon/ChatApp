import express, { NextFunction } from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import socket, { ISocket } from './socket'
import { randomUUID } from "crypto";

const port = process.env.SOCKET_URL_SERVER || 'https://vercel.com/evgeniyhalimon/chat-app/2Sbr1ShJf5ZCAdUiRvzg8Wsh3VmZ'

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

})
