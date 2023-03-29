import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import InMemoreMessageStore from "./messageStore";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  disconnect: 'disconnect',
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    USERS: 'USERS',
    USERS_CONNECTED: 'USERS_CONNECTED',
    USER_DISSCONNECTED: 'USER_DISCONNECTED',
  },
};

interface ISocket extends Socket{
  userID: string,
  username: string
}

const rooms: Record<string, { name: string }> = {};

let users: any[] = []
const messageStore = new InMemoreMessageStore()

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: ISocket ) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      // create a roomId
      const roomId = randomUUID();
      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      /* socket.join(roomId); */

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      
      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // emit event back the room creator saying they have joined a room
      /* socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId); */
    });

    /*
     * When a user sends a room message
     */

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${minutes}`,
        });
      }
    );

    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    //PRIVATE MESSAGING

    //emit session details
    socket.emit("session", {
      userID: socket.userID
    })

    //join the userID room
    socket.join(socket.userID)

    const messages = messageStore.findMessagesForUser(socket.userID)
    const messagesPerUser = new Map()
    messages.forEach(message => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;

      if (messagesPerUser.has(otherUser)) {
          messagesPerUser.get(otherUser).push(message);
      } else {
          messagesPerUser.set(otherUser, [message]);
      }
    });

    users.push({
        userID: socket.userID,
        username: socket.username,
        connected: socket.connected,
        messages: messagesPerUser.get(socket.userID) || [],
    });

    socket.emit(EVENTS.SERVER.USERS, users)

    //notify existing users
    socket.broadcast.emit(EVENTS.SERVER.USERS_CONNECTED, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
      messages: []
    })

    //forward the private msgs to the right recipent (and to other tabs of the sender)
    socket.on(EVENTS.CLIENT.PRIVATE_MESSAGE, ({ content, to }) => {
      const message = {
        content,
        from: socket.userID,
        to
      }

      socket.to(to).emit(EVENTS.CLIENT.PRIVATE_MESSAGE, message)
      messageStore.saveMessage(message)

      
    })
    //notify users on disconnection
    socket.on(EVENTS.disconnect, async () => {
      const matchingSockets: any = await io.in(socket.userID).fetchSockets()
      const isDisconnected = matchingSockets.size === 0

      if(isDisconnected){
        socket.broadcast.emit(EVENTS.SERVER.USERS_CONNECTED, socket.userID)
      }

      users = users.filter(user => user.userID !== socket.userID);
    })

  });
}

export default socket;