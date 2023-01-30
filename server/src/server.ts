import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import config from 'config'
import logger from './utils/logger'
import socket from './socket'

const port = config.get<number>("port")
const host = config.get<string>("host")
const corsOrigin = config.get<string>("corsOrigin")

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: { 
        origin : corsOrigin,
        credentials: true
    }
})

app.get('/', (_, res) => {
    res.send("Server is up")
})

httpServer.listen(port, host, () => {
    logger.info(`🚀 Server is listening on port ${port} 🚀`)
    socket({io})
})
