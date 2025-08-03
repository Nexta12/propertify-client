import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [onlineInfo, setOnlineInfo] = useState({
    totalOnline: 0,
    guests: [],
    loggedInUsers: [],
  });


  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
    });

    if (userId) {
      socketInstance.emit("addUser", userId);
    }

    socketInstance.on("getOnlineUsers", (data) => {
      setOnlineInfo(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineInfo }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
