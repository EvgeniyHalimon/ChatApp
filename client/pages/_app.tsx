import SocketProvider from 'context/socket.context';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}

export default MyApp;