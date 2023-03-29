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
}

export default EVENTS