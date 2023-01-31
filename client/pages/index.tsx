import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useRef } from "react";
import { useSockets } from '../context/socket.context';
import Rooms from "components/Rooms";
import Messages from "components/Messages";

export default function Home() {
    const {socket, username, setUsername} = useSockets()
    const usernameRef = useRef<any>(null)

    const handleSetUserName = () => {
        const value = usernameRef?.current?.value
        if(!value) return
        setUsername(value)
        localStorage.setItem("username", value)
    }

    useEffect(() => {
        if (usernameRef){
          usernameRef.current.value = localStorage.getItem("username") || "";
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
                <Rooms />
                <Messages />
              </div>
            )}
        </div>
    )
}