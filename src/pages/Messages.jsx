// src/pages/Messages.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch, FaPlus, FaArrowLeft } from 'react-icons/fa';
import ConversationList from '../components/chat/ConversationList';

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(state => state?.user?.currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const isConversationView = location.pathname.includes('/messages/');

  return (
    <div className="flex flex-col py-16 md:flex-row h-[100dvh] max-h-[100dvh] overflow-x-hidden rounded-2xl gap-3 bg-white dark:bg-gray-900">

      {/* Conversation List Panel - Always visible in desktop, conditional in mobile */}
   <div 
      className={`w-full md:w-80 lg:w-96 flex flex-col border-r dark:border-gray-800 ${
        isConversationView ? 'hidden md:flex' : 'flex'
      }`}
    >

        <div className="p-4 border-b dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
             <button 
              onClick={() => navigate('/')}
              className="mr-4 text-gray-600 dark:text-gray-300"
            >
              <FaArrowLeft size={13} />
            </button>
            <h2 className="text-xl font-bold dark:text-white">Messages</h2>
            <button 
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
              onClick={() => console.log('Start new conversation')}
            >
              <FaPlus size={16} />
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>
           <div className="flex-1 overflow-y-auto">
          <ConversationList  searchTerm={searchTerm} />
        </div>
      </div>

   

      {/* Conversation View Panel */}
      <div 
        className={`flex-1 min-w-0 flex flex-col ${
          isConversationView ? 'flex' : 'hidden md:flex'
        }`}
      >
        {/* Mobile header */}
        {isConversationView && (
          <div className="md:hidden p-4 rounded-2xl border-b dark:border-gray-800 flex items-center">
            <button 
              onClick={() => navigate('/messages')}
              className="mr-4 text-gray-600 dark:text-gray-300"
            >
              <FaArrowLeft size={13} />
            </button>
            <h2 className="text-xl font-bold dark:text-white">Chat</h2>
          </div>
        )}
        
         <div className="flex-1 overflow-y-auto rounded-2xl">
    <Outlet />
  </div>
          
          {/* Empty state for desktop */}
          {!isConversationView && (
             <div className="hidden md:flex flex-col rounded-2xl items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
              <div className="text-center p-8">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-2xl font-bold dark:text-white mb-2">Select a conversation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a conversation to start chatting or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default Messages;