import React from 'react';

type Entity = {
  id: string;
  timestamp: string;
  message: string;
  username: string;
}

type Props = {
  message: Entity;
  userMessage: boolean;
}

const Message: React.FC<Props> = ({ message, userMessage }) => {
  const messageClass = userMessage ? "flex py-1 w-full justify-end" : "flex py-1 w-full";

  return (
    <div className={messageClass}>
      <img className="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/11646882" alt="Profile pic" />
      <div className="flex flex-col leading-1.5 p-4 ml-2 border-gray-200 bg-indigo-400 rounded-e-xl rounded-es-xl">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-white">{message.username}</span>
          <span className="text-sm font-normal text-gray-200">{message.timestamp}</span>
        </div>
        <p className="break-words max-w-sm text-sm font-normal py-2.5 text-white">{message.message}</p>
      </div>
    </div>
  );
}

export default Message;
