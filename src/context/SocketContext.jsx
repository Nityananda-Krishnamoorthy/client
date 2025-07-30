import React, { createContext, useContext } from 'react';
import {useSocket} form "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ socket, children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};