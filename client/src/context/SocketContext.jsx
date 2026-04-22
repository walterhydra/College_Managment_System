import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let newSocket;
    if (user) {
      newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join_room', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
