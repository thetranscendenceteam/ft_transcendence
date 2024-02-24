import React, { useState, useEffect, useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import addButton from '../../../public/add-button.png';
import joinButton from '../../../public/joinButton.png';
import Image from 'next/image';
import NewChannel from './newChannel';
import JoinPublicChannel from './joinPublicChannel';
import { gql, useQuery } from "@apollo/client";
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

type Props = {
  activeConv: Chat | null;
  changeConv: Function;
  changeConvType: Function;
  refresh: boolean;
}

const GET_CHATS_BY_ID_USER = gql`
  query getChatsByIdUser($userId: String!) {
    getChatsByIdUser(userId: $userId) {
      idChat
      userInfo {idUser, pseudo, avatar}
      name
      isPrivate
      isWhisper
      role
      status
    }
  }
`;

const Sidebar = ({ changeConv, activeConv, changeConvType, refresh }: Props) => {
  const [activeList, setActiveList] = useState<string>('Friends');
  const [createNewChannel, setCreateNewChannel] = useState(false);
  const [joinPublicChannel, setJoinPublicChannel] = useState(false);
  const [data, setData] = useState<Chat[]>([]);
  const { user } = useContext(UserContext);

  let { data: fetchedData } = useQuery(GET_CHATS_BY_ID_USER, {
    variables: { userId: user ? user.id : '' },
    pollInterval: 500,
    skip: !user || !user.id,
  });

  useEffect(() => {
    if (!fetchedData) return;
    const tmp = fetchedData.getChatsByIdUser.map((item: any) => ({
      id: item.idChat,
      targetId: item.userInfo ? item.userInfo.idUser : '',
      name: item.userInfo ? item.userInfo.pseudo : item.name,
      role: item.role,
      status: item.status,
      isPrivate: item.isPrivate,
      isWhisper: item.isWhisper,
      avatar: item.userInfo ? item.userInfo.avatar : ""
    }));
    setData(tmp);
  }, [refresh, fetchedData]);

  useEffect(() => {
    if (activeConv && data.find((chat) => chat.id === activeConv?.id)) return;
      changeConv(null);
  }, [data, changeConv]);

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
    if (buttonName === activeList) return;
    setActiveList(buttonName);
    changeConv(null);
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

  const handleClick = (conv: Chat) => {
    changeConv(conv);
    changeConvType(activeList);
  };

  return (
    <div className='h-full flex flex-col bg-indigo-800 rounded-l-lg'>
      <div className='bg-white h-12 grid grid-cols-2 grid-row-1 items-center justify-center'>
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
                <SidebarChat key={conversation.id} avatarUrl={conversation.avatar} fallback="🔐" nickname={conversation.name} />
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
