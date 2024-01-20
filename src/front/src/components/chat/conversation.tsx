import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import menuIcon from '../../../public/more.png';
import sendIcon from '../../../public/send.png';

type Props = {
  className: string;
}

const Conversation = ({ className }: Props) => {
  const [isMenuOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    'Message 1',
    'Message 2',
    'Message 3',
  ])
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isMenuOpen);
  };

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    }
  })

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log('Sending message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  }

  return (
    <div className={`relative h-full flex flex-col items-center justify-center bg-white ${className} rounded-r-lg`}>
      <button onClick={toggleMenu} className="absolute top-0 right-0 m-2 p-2 bg-gray-200 rounded-full">
        <Image src={menuIcon} alt="Menu Icon" width={12} height={12} />
      </button>
      <div className="relative mt-auto w-full mb-2 px-1">
        <div className="w-full overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="w-full text-black">
              {message}
            </div>
          ))}
        </div>
        <input 
          type="text"
          className="w-full border text-gray-700 border-gray-500 rounded-lg pl-1 pr-10 outline-none"
          placeholder="Type here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button className="absolute right-2 bottom-1 cursor-pointer pr-1" onClick={sendMessage}>
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
