import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import { SocketProvider } from '../src/context/SocketContext.js';
// import io from 'socket.io-client';

// const socket = io(import.meta.env.VITE_API_URL, {
//   withCredentials: true,
//   autoConnect: true,
// });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <SocketProvider socket={socket}> */}
      <App />
    {/* </SocketProvider> */}
  </React.StrictMode>
);