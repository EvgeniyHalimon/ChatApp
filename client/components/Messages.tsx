import EVENTS from 'config/events';
import { useEffect, useRef } from 'react';
import { useSockets } from '../context/socket.context';
import styles from "../styles/Messages.module.css";

const Messages = () => {
  const {socket, messages, roomId, username, setMessages} = useSockets()
  const newMessageRef = useRef<any>(null)
  const messageEndRef = useRef<any>(null);

  const handleSendMessage = () => {
    const message = newMessageRef.current.value

    if(!String(message).trim()) return

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {roomId, message, username})

    const date = new Date()

    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()

    setMessages([
      ...messages,
      {
        username: 'me',
        message,
        time: `${date.getHours()}:${minutes}`
      }
    ])

    newMessageRef.current.value = ""
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if(!roomId){
    return <div />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messageList}>
        {messages?.map(({ message, username, time }) => {
          return (
            <div key={message} className={styles.message}>
              <div key={message} className={styles.messageInner}>
                <span className={styles.messageSender}>
                  {username} - {time}
                </span>
                <span className={styles.messageBody}>{message}</span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className={styles.messageBox}>
        <textarea
          rows={1}
          placeholder="Tell us what you are thinking"
          ref={newMessageRef}
        />
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </div>
  )
}

export default Messages