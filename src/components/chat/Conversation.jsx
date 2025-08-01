import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaPaperclip, FaSmile, FaPaperPlane, FaEllipsisV } from 'react-icons/fa';
import { IoVideocam, IoCall } from 'react-icons/io5';
import socket from '../../socket';
import MessageBubble from './MessageBubble';
import Avatar from '../Avatar';
import formatTimeAgo from '../../helpers/TimeAgo';

const Conversation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setError('Conversation ID is missing');
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const [convRes, messagesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/chats/conversations/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/chats/conversations/${id}/messages`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        setConversation(convRes.data);
        setMessages(messagesRes.data.messages);
        setError(null);
        socket.emit('join-conversations', [id]);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation.');
        if (err.response?.status === 404) navigate('/messages');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id, user.token, navigate]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewMessage = (message) => {
      if (message.conversationId === id) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleMessageStatusUpdate = (update) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === update.messageId ? { ...msg, ...update.updates } : msg
        )
      );
    };

    socket.on('new-message', handleNewMessage);
    socket.on('message-status-update', handleMessageStatusUpdate);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-status-update', handleMessageStatusUpdate);
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (id) socket.emit('leave-conversation', id);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append('conversationId', id);
      formData.append('text', newMessage);
      if (file) formData.append('media', file);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chats/messages`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewMessage('');
      setFile(null);
      socket.emit('send-message', res.data);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Conversation not found.</p>
      </div>
    );
  }

  const otherParticipants = conversation.participants?.filter(
    p => p._id !== user?._id
  ) || [];

  const displayName = conversation.isGroup
    ? conversation.groupName
    : otherParticipants[0]?.fullName || otherParticipants[0]?.userName || 'Unknown';

  const profilePhoto = conversation.isGroup
    ? conversation.groupPhoto
    : otherParticipants[0]?.profilePhoto;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Avatar src={profilePhoto} size="lg" name={displayName} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{displayName}</h3>
            {!conversation.isGroup && (
              <p className="text-xs text-gray-500">
                {otherParticipants[0]?.isOnline
                  ? 'Online'
                  : formatTimeAgo(otherParticipants[0]?.lastSeen)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <IoVideocam size={20} />
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <IoCall size={18} />
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <FaEllipsisV size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <MessageBubble
                key={message._id}
                message={message}
                isSender={message.senderId._id === user._id}
                sender={message.senderId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {file && (
          <div className="mb-2 flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm truncate">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-500 hover:text-blue-500">
            <label htmlFor="file-upload" className="cursor-pointer">
              <FaPaperclip size={18} />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*"
            />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-blue-500">
            <FaSmile size={20} />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() && !file}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
