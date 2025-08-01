// src/components/messages/ConversationList.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Menu } from '@headlessui/react';
import Avatar from '../Avatar';
import formatTimeAgo from '../../helpers/TimeAgo';
import { FaEllipsisV } from 'react-icons/fa';

const ConversationList = ({ searchTerm = '' }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/chats/conversations`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setConversations(res?.data?.conversations || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = conversations.filter(conv => {
      if (conv.isGroup) {
        return conv.groupName?.toLowerCase().includes(lowerSearch);
      } else {
        const otherUser = conv.participants?.find(p => p._id !== user?._id);
        return (
          otherUser?.fullName?.toLowerCase().includes(lowerSearch) ||
          otherUser?.userName?.toLowerCase().includes(lowerSearch)
        );
      }
    });

    setFilteredConversations(filtered);
  }, [searchTerm, conversations, user]);

  const handleDeleteConversation = async (conversationId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/chats/${conversationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setConversations(prev => prev.filter(c => c._id !== conversationId));
    } catch (err) {
      console.error('Failed to delete conversation', err);
      alert('Failed to delete conversation.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl max-w-md mx-auto p-6">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!filteredConversations.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        <div className="max-w-xs mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-4">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="font-medium text-lg mb-1">No conversations yet</h3>
            <p className="text-sm">Start a conversation to see it here</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg">
            Start Chatting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredConversations.map((conv) => {
        const isGroup = conv.isGroup;
        const lastMessage = conv.lastMessage;
        const unreadCount = conv.unreadCount || 0;

        const otherParticipants = conv.participants?.filter(p => p._id !== user?._id) || [];
        const otherUser = otherParticipants[0];

        const displayName = isGroup
          ? conv.groupName
          : otherUser?.fullName || otherUser?.userName || 'Unknown';

        const profilePhoto = isGroup ? conv.groupPhoto : otherUser?.profilePhoto;

        let lastMessagePreview = 'Start a conversation';
        let messageIcon = '';
        if (lastMessage) {
          if (lastMessage.text) lastMessagePreview = lastMessage.text;
          else if (lastMessage.media?.length) {
            lastMessagePreview = 'Media';
            messageIcon = '🖼️';
          } else if (lastMessage.call) {
            lastMessagePreview = `${lastMessage.call.type === 'video' ? 'Video' : 'Voice'} call`;
            messageIcon = lastMessage.call.type === 'video' ? '📹' : '📞';
          }
        }

        return (
          <div key={conv._id} className="group relative transition-all">
            <Link
              to={`/messages/${conv._id}`}
              className="flex items-center gap-4 p-4 backdrop-blur-md bg-white/80 dark:bg-gray-900/70 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:scale-[1.01]"
            >
              <div className="relative w-14 h-14 shrink-0">
                <div className="w-full h-full overflow-hidden rounded-full border-2 border-white dark:border-gray-700 shadow">
                  <Avatar src={profilePhoto} size="lg" name={displayName} />
                </div>
                {!isGroup && otherUser?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {displayName}
                  </h4>
                  {lastMessage?.createdAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {formatTimeAgo(lastMessage.createdAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {messageIcon && <span>{messageIcon}</span>}
                  <span>{lastMessagePreview}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {unreadCount > 0 && (
                  <span className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
                <Menu as="div" className="relative">
                  <Menu.Button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisV />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 z-10 mt-0 w-48 bg-white dark:bg-[#282c35] shadow-lg rounded-md border border-gray-200 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteConversation(conv._id);
                          }}
                          className={`$${active ? 'bg-red-50' : ''} text-red-200 w-full text-left px-4 py-2`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </Link>

            <div className="absolute -bottom-3 left-0 w-full flex justify-center pointer-events-none">
              <div className="w-10 h-3 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent rounded-t-[100%] blur-sm"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
