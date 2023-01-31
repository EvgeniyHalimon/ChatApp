import SocketProvider from 'context/socket.context';
import { AppProps } from 'next/app';
import "../styles/globals.css";

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}

export default MyApp;