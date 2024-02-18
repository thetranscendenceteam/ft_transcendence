import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Image from 'next/image';
import menuIcon from '../../../public/more.png';
import sendIcon from '../../../public/send.png';
import Message from './message';
import Options from './options';
import { OnSubscriptionDataOptions, gql, useQuery, useSubscription } from "@apollo/client"
import apolloClient from "../apolloclient";
import { UserContext } from '../userProvider';

type Chat = {
  id: string;
  targetId: string;
  name: string;
  role: string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

type Message = {
  id: string;
  timestamp: string;
  message: string;
  username: string;
  avatar?: string;
  link?: string;
}

type Props = {
  className: string;
  activeConv: Chat;
  convType: string;
  refresh: () => void;
}

const GET_COMMENTS =  gql`
  query getMessageHistoryOfChat($chatId: String!) {
    getMessageHistoryOfChat(chatId: $chatId) {
      id
      timestamp
      message
      username
      avatar
    }
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
  subscription OnNewMessage($chatId: String!) {
    newMessage(chatId: $chatId) {
      timestamp
      message
      username
      avatar
    }
  }
`;

const formatTime = (timeStampStr: string) => {
  const timestamp = new Date(timeStampStr);
  return (timestamp.toLocaleDateString(undefined, { hour: 'numeric', minute: 'numeric', hour12: false }));
};

const Conversation = ({ className, activeConv, convType, refresh }: Props) => {
  const [isMenuOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  let [messages, setMessages] = useState<Message[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const { user } = useContext(UserContext);

  let { data:datam, loading:loadingm } = useQuery(GET_COMMENTS,
    {
      variables: {
        chatId: activeConv.id
      }
    }
  );

  useEffect(() => {
    if (!loadingm && datam) {
      let m = datam.getMessageHistoryOfChat;
      const formattedData = m.map((message: Message) => ({
        ...message,
        timestamp: formatTime(message.timestamp)
      }));
      setMessages(formattedData);
    }
  }, [datam, loadingm]);

  const onMessage = useCallback((result: OnSubscriptionDataOptions) => {
    if (!result.subscriptionData.data) return;
    console.log(result.subscriptionData.data.newMessage.message);
    const lastMessage = result.subscriptionData.data.newMessage;
    setMessages((prevMessages) => [...prevMessages, lastMessage]);
  }, []);

  useSubscription(COMMENTS_SUBSCRIPTION, {
    variables: { "chatId": activeConv.id },
    fetchPolicy: "no-cache",
    onSubscriptionData: onMessage
  });

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

  const sendMessage = async(message: string, username: string, chatId: string) => {
    if (message === "")
      return;
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation AddMessage($input: SendMessageInput!) {
            addMessage(message: $input)
          }
        `,
        variables: {
          input: {
            message: message,
            username: username,
            chatId: chatId
          }
        }
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error senging message:", error);
    }
  };

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  })

  return (
    <div className={`relative h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-indigo-500 ${className} rounded-r-lg`}>
      <button onClick={toggleMenu} className="absolute top-0 right-3 m-2 p-2 bg-gray-200 rounded-full menu-button">
        <Image src={menuIcon} alt="Menu Icon" width={12} height={12} className="menu-button"/>
      </button>
      <div className="mt-auto w-full mb-2 px-1 overflow-y-auto min-h-0 " ref={conversationRef}>
        <div className="w-full flex-flex-col">
          {messages.map((message, index) => (
            <Message key={index} message={message} isMine={user?.username || ""} />
          ))}
        </div>
      </div>
      {activeConv.status !== 'muted' && (
        <div className="px-1 pb-1 w-full">
          <input 
            type="text"
            className="w-full border bg-indigo-400 placeholder-gray-300 text-white border-indigo-300 rounded-lg pl-1 pr-10 outline-none"
            placeholder="Type here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && user) {
                sendMessage(newMessage, user.username, activeConv?.id || "");
              }
            }}
          />
          <button className="absolute right-2 bottom-2 cursor-pointer pr-1" onClick={() => sendMessage(newMessage, user?.username || "", activeConv.id)}>
            <Image src={sendIcon} alt="Send Icon" width={16} height={16} />
          </button>
        </div>
      )}

      {(isMenuOpen && activeConv) && (
        <Options ref={menuRef} convType={convType} toggleMenu={toggleMenu} activeConv={activeConv} refresh={refresh}/>
      )}
    </div>
  );
};

export default Conversation;
