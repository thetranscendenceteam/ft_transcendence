import React, { useState, useEffect, useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import addButton from '../../../public/add-button.png';
import joinButton from '../../../public/joinButton.png';
import Image from 'next/image';
import NewChannel from './newChannel';
import JoinPublicChannel from './joinPublicChannel';
import apolloClient from "../apolloclient";
import { gql } from "@apollo/client";
import { UserContext } from '../userProvider';

type Chat = {
  id: string;
  name: string;
  role: string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

type Props = {
  changeConv: (ChatName: Chat) => void;
  changeConvType: (newType: string) => void;
}

const Sidebar: React.FC<Props> = ({ changeConv, changeConvType }) => {
  const [activeList, setActiveList] = useState<string>('Friends');
  const [createNewChannel, setCreateNewChannel] = useState(false);
  const [joinPublicChannel, setJoinPublicChannel] = useState(false);
  const [data, setData] = useState<Chat[]>([]);
  const [rifresh, setRifresh] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const fetchData = async() => {
    if (user) {
      try {
        const { data } = await apolloClient.query({
          query: gql`
              query getChatsByIdUser($userId: String!) {
                getChatsByIdUser(userId: $userId) {
                  idChat 
                  name
                  role 
                  status
                  isPrivate
                  isWhisper
                }
              }
          `,
          variables: {
            userId: user.id
          }
        });
        return (data.getChatsByIdUser);
      } catch (error) {
        return ([]);
      }
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData();
      const tmp = fetchedData.map((item: any) => ({
        id: item.idChat,
        name: item.name,
        role: item.role,
        status: item.status,
        isPrivate: item.isPrivate,
        isWhisper: item.isWhisper,
        avatar: ""
      }));
      setData(tmp);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleReload = () => {
      window.location.reload();
    };
    window.addEventListener("beforeunload", handleReload);
    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, []);

  const openCreateChannel = () => {
    setCreateNewChannel(true);
  };

  const closeCreateChannel = () => {
    setCreateNewChannel(false);
  };

  const openJoinPublicChannel = () => {
    setJoinPublicChannel(true);
  };

  const closeJoinPublicChannel = () => {
    setJoinPublicChannel(false);
  };

  const changeActiveList = (buttonName: string) => {
    setActiveList(buttonName);
  };

  const addChat = (newChat: Chat) => {
    setData((prevData) => {
      const isChatExists = prevData.some(chat => chat.id === newChat.id);

      if (!isChatExists) {
        return [...prevData, newChat];
      }

      return prevData;
    });
  };

  const refresh = () => {
    setRifresh(!rifresh);
  }

  const handleClick = (conv: Chat) => {
    changeConv(conv);
    changeConvType(activeList);
  };

  return (
    <div className='h-full flex flex-col bg-indigo-800 rounded-l-lg'>
      <div className='bg-white h-12 flex grid grid-cols-2 grid-row-1 items-center justify-center'>
        <button className='border-r border-gray-500 bg-indigo-950 h-full transition-all duration-300 hover:opacity-60' onClick={() => changeActiveList('Friends')}>Friends</button>
        <button className='h-full transition-all duration-300 hover:opacity-60 bg-indigo-950' onClick={() => changeActiveList('Channels')}>Channels</button>
      </div>
      <div className='h-full overflow-y-auto'>
        <div className='flex flex-col'>
          {data
            .filter((conversation) => {
              if (activeList === 'Friends') {
                return (conversation.isWhisper);
              } else {
                return (!conversation.isWhisper);
              }
            })
            .map((conversation, index) => (
              <button key={index} className="cursor-pointer" onClick={() => handleClick(conversation)}>
                <SidebarChat key={conversation.id} avatarUrl="" fallback="..." nickname={conversation.name} />
              </button>
            ))
          }
          {activeList === 'Channels' && (
            <>
              <div className='h-20 bg-indigo-950 flex items-center justify-center border-t border-gray-500'>
                <button onClick={openCreateChannel}>
                  <Image src={addButton} alt="Add" width={40} height={40} />
                </button>
                {createNewChannel && <NewChannel closePopUp={closeCreateChannel} addChat={addChat} />}
              </div>
              <div className='h-20 bg-indigo-950 flex items-center justify-center border-t border-gray-500'>
                <button onClick={openJoinPublicChannel}>
                  <Image src={joinButton} alt="Add" width={40} height={40} />
                </button>
                {createNewChannel && <NewChannel closePopUp={closeCreateChannel} addChat={addChat} />}
                {joinPublicChannel && <JoinPublicChannel closePopUp={closeJoinPublicChannel} addChat={addChat} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const SidebarChat: React.FC<{ avatarUrl: string; fallback: string; nickname: string }> = ({ avatarUrl, fallback, nickname }) => {
  return (
    <div className='hover:bg-purple-700 h-20 bg-purple-900 flex items-center justify-start border-t border-b border-gray-500'>
      <Avatar className='h-9 w-9 ml-4 mr-4'>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <span className='w-full overflow-hidden'>{nickname}</span>
    </div>
  )
}

export default Sidebar;
