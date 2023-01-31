import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from 'config/default';
import { createContext, useContext, useState, useEffect } from 'react';
import EVENTS from '../config/events';

interface Context {
    socket: Socket;
    username?: string;
    setUsername: any;
    messages: { message: string; time: string; username: string }[];
    setMessages: any;
    roomId?: string;
    rooms: any;
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
    const [roomId, setRoomId] = useState('')
    const [rooms, setRooms] = useState({})
    const [messages, setMessages] = useState<any>([])

    socket.on(EVENTS.SERVER.ROOMS, (value) => {
        setRooms(value)
    })

    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
        setRoomId(value)
        setMessages([])
    })

    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({message, username, time}) => {
        if(!document.hasFocus()){
            document.title = ""
        }
        setMessages([...messages, {message, username, time}])
    })

    useEffect(() => {
        window.onfocus = function () {
            document.title = "Chat App"
        }
    },[])

    return (
        <SocketContext.Provider 
            value={{
                socket, 
                username, 
                setUsername, 
                roomId, 
                rooms, 
                messages, 
                setMessages
            }} 
            {...props}
        />
    )
}

export const useSockets = () => useContext(SocketContext)

export default SocketProvider