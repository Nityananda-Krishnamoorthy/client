// src/components/messages/MessageBubble.js
import React from 'react';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import formatTimeAgo from '../../helpers/TimeAgo';
import Avatar from '../Avatar';

const MessageBubble = ({ message, isSender, sender }) => {
  // Determine if the message is a call
  const isCall = message.call;
  const isMedia = message.media && message.media.length > 0;

  // Determine the status icon
  const getStatusIcon = () => {
    if (!isSender) return null;

    switch (message.status) {
      case 'seen':
        return <FaCheckDouble className="text-blue-500" />;
      case 'delivered':
        return <FaCheckDouble className="text-gray-400" />;
      case 'sent':
        return <FaCheck className="text-gray-400" />;
      default:
        return <FaCheck className="text-gray-400" />;
    }
  };

  // Render call message
  const renderCall = () => {
    if (!isCall) return null;

    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {message.call.type === 'video' ? '📹' : '📞'}
        </span>
        <span className="font-medium">
          {message.call.type === 'video' ? 'Video Call' : 'Voice Call'}
        </span>
        <span className="text-xs text-gray-500">
          {message.call.duration ? `(${message.call.duration}s)` : ''}
        </span>
      </div>
    );
  };

  // Render media message
  const renderMedia = () => {
    if (!isMedia) return null;

    return (
      <div className="grid grid-cols-2 gap-2">
        {message.media.map((url, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <img src={url} alt="media" className="w-full h-auto object-cover" />
            ) : url.match(/\.(mp4|webm)$/) ? (
              <video src={url} className="w-full" controls />
            ) : (
              <audio src={url} controls />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${isSender ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'}`}>
        {/* Sender name in group if not sender */}
        {!isSender && sender && (
          <div className="font-semibold text-xs mb-1">{sender.fullName || sender.userName}</div>
        )}

        {/* Message content */}
        {isCall && renderCall()}
        {isMedia && renderMedia()}
        {message.text && (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        )}

        {/* Timestamp and status */}
        <div className={`flex items-center justify-end mt-1 text-xs ${isSender ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{formatTimeAgo(message.createdAt)}</span>
          {isSender && (
            <span className="ml-1">
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;