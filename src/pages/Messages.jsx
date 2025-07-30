// src/pages/Messages.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(state => state?.user?.currentUser);
  
  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Sidebar - visible on larger screens */}
      <div className="hidden md:block w-full md:w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
        <div className="p-4 border-b dark:border-gray-800 flex items-center">
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </div>
        <Outlet />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b dark:border-gray-800 flex items-center">
          <button 
            onClick={() => navigate('/messages')}
            className="mr-4 text-gray-600 dark:text-gray-300"
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold dark:text-white">Chat</h2>
        </div>
        
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Messages;