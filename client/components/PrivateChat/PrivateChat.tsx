import EVENTS from "config/events";
import { useSockets } from "context/socket.context"
import Image from "next/image";
import { useEffect, useState } from "react";
import useMessages from "../hooks/useMessages";

import style from './privateChat.module.css';

const PrivateChat = () => {
    const {socket, username} = useSockets()
    const [users, setUsers] = useState<any>([]);
    const [message, setMessage] = useState('');
    const [chatUser, setChatUser] = useState(0);
    const [messages, setMessages] = useMessages();
    console.log("🚀 ~ file: PrivateChat.tsx:15 ~ PrivateChat ~ messages:", messages)

    const postMessage = (message: string) => {
        const msg = {
            content: message,
            to: users[chatUser].userID
        };

        socket.emit(EVENTS.CLIENT.PRIVATE_MESSAGE, msg);

        setMessages((messages: any) => [
            ...messages,
            msg
        ]);

        setMessage('');
    }

    useEffect(() => {
        socket.on(EVENTS.SERVER.USERS, (users) => {
            setUsers(users);
            setChatUser(0);
        });

        socket.on(EVENTS.SERVER.USER_CONNECTED, user => {
            setUsers((users: any) => {
                const userExists = users.includes(user);

                if (!userExists) {
                    return [...users, user];
                }

                return users;
            });
        });
    }, [socket]);

    useEffect(() => {
        socket.on(EVENTS.SERVER.USER_DISSCONNECTED, disconnectedUserID => {
            const newUsers = users.filter((user:any) => user.userID !== disconnectedUserID);

            setUsers(newUsers);
        });
    }, [users, socket])

    return (
        <>
            <div className={style.chat}>
                <div className={style.left}>
                    <div className={style.user_info}>
                        {/* <Image src='https://cdn-icons-png.flaticon.com/512/6386/6386976.png' 
                        width={30} height={30} alt="User avatar" /> */}
                        <div>++++{username}++++</div>
                    </div>

                    <div className={style.users}>
                        {users.map((user: any, index: number) => (
                            <div
                                className={`${style.user} ${chatUser === index ? style.active : style.inactive}`}
                                onClick={() => setChatUser(index)}
                                key={index}>
                                {user.username}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.right}>
                    {users[chatUser] ?
                        <>
                            <div className={style.sticky_header}>
                                <div className={style.user}>
                                    <h3>{users[chatUser] ? users[chatUser].username : null}</h3>
                                </div>
                            </div>

                            <div className={style.chat_ui}>
                                <div className={style.messages_list}>
                                    {
                                        messages
                                            .filter((message: { from: any; to: any; }) => message.from === users[chatUser].userID || message.to === users[chatUser].userID)
                                            .map((message: any, index: number) => (
                                                <div
                                                    className={`${style.message} ${message.from === users[chatUser].userID ? style.received : style.sent}`}
                                                    key={index}>
                                                    {message.content}
                                                </div>
                                            ))
                                    }
                                </div>

                                <div className={style.message_box}>
                                    <input
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        type="text"
                                        placeholder="Your message"
                                    />

                                    <button onClick={() => postMessage(message)}>Send</button>
                                </div>
                            </div>
                        </> :
                        <div className={style.no_user_selected}>
                            <h3>Select a user</h3>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default PrivateChat