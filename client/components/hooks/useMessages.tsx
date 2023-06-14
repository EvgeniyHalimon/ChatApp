import EVENTS from "config/events";
import { useSockets } from "context/socket.context";
import { useState, useEffect } from "react";

const useMessages = () => {
    const { socket } = useSockets()
    const [messages, setMessages] = useState<any>([]);

    useEffect(() => {

        socket.on(EVENTS.CLIENT.PRIVATE_MESSAGE, (message) => {
            setMessages((messages: any) => [
                ...messages,
                message
            ]);
        });

        return () => {
            socket.off()
        };
    }, [socket]);

    return [messages, setMessages];
}

export default useMessages;