import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import addButton from '../../../public/add-button.png';
import Image from 'next/image';
import NewChannel from './newChannel';
import apolloClient from "../apolloclient";
import { gql } from "@apollo/client"

type Conv = {
  id: string;
  nickname: string;
  avatar: string;
}

type Props = {
  changeConvType: (buttonName: string) => void;
}

const fetchData = async() => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        {
          getUsers {
            id 
            nickname: pseudo
            avatar
          }
        }
      `,
    });
    return (data.getUsers);
  } catch (error) {
    return ([]);
  }
}

const Sidebar: React.FC<Props> = ({ changeConvType }) => {
  const [activeList, setActiveList] = useState<string>('Friends');
  const [createNewChannel, setCreateNewChannel] = useState(false);
  const [data, setData]= useState<Conv[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
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

  const changeActiveList = (buttonName: string) => {
    setActiveList(buttonName);
  };

  const addConv = (newConv: Conv) => {
    setData((prevData) => [...prevData, newConv]);
  };

  return (
    <div className='h-full flex flex-col bg-indigo-800 rounded-l-lg'>
      <div className='bg-white h-12 flex grid grid-cols-2 grid-row-1 items-center justify-center'>
        <button className='border-r border-gray-500 bg-indigo-950 h-full transition-all duration-300 hover:opacity-60' onClick={() => changeActiveList('Friends')}>Friends</button>
        <button className='h-full transition-all duration-300 hover:opacity-60 bg-indigo-950' onClick={() => changeActiveList('Channels')}>Channels</button>
      </div>
      <div className='h-full overflow-y-auto'>
        <div className='flex flex-col'>
          {data.map(conversation => (
            <button key={conversation.id} className="cursor-pointer" onClick={() => changeConvType(activeList)}>
              <SidebarChat key={conversation.id} avatarUrl={conversation.avatar} fallback="..." nickname={conversation.nickname} />
            </button>
          ))}
          {activeList === 'Channels' && (
            <div className='h-20 bg-indigo-950 flex items-center justify-center border-t border-gray-500'>
              <button onClick={openCreateChannel}>
                <Image src={addButton} alt="Add" width={40} height={40} />
              </button>
              {createNewChannel && <NewChannel closePopUp={closeCreateChannel} addConv={addConv} />}
            </div>
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
