import { useEffect, useRef } from "react";
import { useSockets } from '../context/socket.context';
import Rooms from "components/Rooms";
import Messages from "components/Messages";
import styles from "../styles/Home.module.css";
import PrivateChat from "components/PrivateChat/PrivateChat";

export default function Home() {
    const {socket, username, setUsername} = useSockets()
    const usernameRef = useRef<any>(null)

    const handleSetUserName = () => {
      const value = usernameRef?.current?.value
      if(!value) return
      setUsername(value)
      localStorage.setItem("username", value)
      socket.auth = { value };
      socket.connect();
    }

    useEffect(() => {
        if (usernameRef){
          usernameRef.current.value = localStorage.getItem("username") ? localStorage.getItem("username") : "";
        }
    }, []);

    return(
        <div>
            {!username && (
              <div className={styles.usernameWrapper}>
                <div className={styles.usernameInner}>
                  <input placeholder="Username" ref={usernameRef} />
                  <button className="cta" onClick={handleSetUserName}>
                    START
                  </button>
                </div>
              </div>
            )}
            {username && (
              <div className={styles.container}>
                {/* <Rooms />
                <Messages /> */}
                <PrivateChat/>
              </div>
            )}
        </div>
    )
}