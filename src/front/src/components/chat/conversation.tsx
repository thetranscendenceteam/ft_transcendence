import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import menuIcon from '../../../public/more.png';
import sendIcon from '../../../public/send.png';
import Message from './message';

type Props = {
  className: string;
}

const Conversation = ({ className }: Props) => {
  const [isMenuOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Message 1', userMessage: false },
    { text: 'Message 2', userMessage: true },
    { text: 'Message 3', userMessage: false },
  ])
  const menuRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isMenuOpen);
  };

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const targetElement = event.target as HTMLElement;
        if (!targetElement || !targetElement.classList.contains("menu-button")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    }
  })

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const newUserMessage = { text: newMessage, userMessage: true };
      console.log('Sending message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setNewMessage('');
    }
  }

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  })

  return (
    <div className={`relative h-full flex flex-col items-center justify-center bg-white dark:bg-gray-600 ${className} rounded-r-lg`}>
      <button onClick={toggleMenu} className="absolute top-0 right-3 m-2 p-2 bg-gray-200 rounded-full menu-button">
        <Image src={menuIcon} alt="Menu Icon" width={12} height={12} className="menu-button"/>
      </button>
      <div className="mt-auto w-full mb-2 px-1 overflow-y-auto min-h-0 " ref={conversationRef}>
        <div className="w-full flex-flex-col">
          {messages.map((message, index) => (
            <Message key={index} index={index} message={message.text} userMessage={message.userMessage} />
          ))}
        </div>
      </div>
      <div className="px-1 pb-1 w-full">
        <input 
          type="text"
          className="w-full border dark:bg-gray-500 dark:text-white text-gray-700 border-gray-500 rounded-lg pl-1 pr-10 outline-none"
          placeholder="Type here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button className="absolute right-2 bottom-2 cursor-pointer pr-1" onClick={sendMessage}>
          <Image src={sendIcon} alt="Send Icon" width={16} height={16} />
        </button>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-10 right-1">
          <ul className="border border-gray-300 rounded-xl text-gray-600 h-50 bg-white hover:border-gray-400">
            <li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Invite</li>
            <li className="hover:bg-gray-200 pl-5 pr-7">Ban</li>
            <li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Mute</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Conversation;
