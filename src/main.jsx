// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import socket from './socket';
import './index.css'

// Connect socket when app starts
socket.connect();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Disconnect socket when app unloads
window.addEventListener('beforeunload', () => {
  socket.disconnect();
});