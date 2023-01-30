import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from 'config/default';
import { createContext, useContext, useState } from 'react';

interface Context {
    socket: Socket;
    username?: string;
    setUsername: Function;
    messages?: { message: string; time: string; username: string }[];
    setMessages: Function;
    roomId?: string;
    rooms: object;
}
  
const socket = io(SOCKET_URL);
  
const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
  rooms: {},
  messages: [],
});

function SocketProvider(props: any){
    const [username, setUsername] = useState('')
    return (
        <SocketContext.Provider value={{socket, username, setUsername}} {...props}/>
    )
}

export const useSockets = () => useContext(SocketContext)

export default SocketProvider