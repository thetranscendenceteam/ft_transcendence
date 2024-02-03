import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import addButton from '../../../public/add-button.png';
import Image from 'next/image';
import NewChannel from './newChannel';

export type userData = {
  id: number;
  nickname: string;
  avatarUrl: string;
  fallback: string;
};

type Props = {
  data: userData[];
  changeConvType: (buttonName: string) => void;
}

const Sidebar: React.FC<Props> = ({ data, changeConvType }) => {
  const [activeList, setActiveList] = useState<string>('Friends');
  const [createNewChannel, setCreateNewChannel] = useState(false);

  const openCreateChannel = () => {
    setCreateNewChannel(true);
  };

  const closeCreateChannel = () => {
    setCreateNewChannel(false);
  };

  const changeActiveList = (buttonName: string) => {
    setActiveList(buttonName);
  };

  return (
    <div className='h-full flex flex-col bg-slate-700 rounded-l-lg'>
      <div className='bg-white h-12 flex grid grid-cols-2 grid-row-1 items-center justify-center'>
        <button className='border-r border-gray-500 bg-slate-800 h-full transition-all duration-300 hover:opacity-60' onClick={() => changeActiveList('Friends')}>Friends</button>
        <button className='h-full transition-all duration-300 hover:opacity-60 bg-slate-800' onClick={() => changeActiveList('Channels')}>Channels</button>
      </div>
      <div className='h-full overflow-y-auto'>
        <div className='flex flex-col'>
          {data.map(conversation => (
            <button className="cursor-pointer" onClick={() => changeConvType(activeList)}>
              <SidebarChat key={conversation.id} avatarUrl={conversation.avatarUrl} fallback={conversation.fallback} nickname={conversation.nickname} />
            </button>
          ))}
          {activeList === 'Channels' && (
            <div className='h-20 bg-slate-900 flex items-center justify-center border-t border-gray-500'>
              <button onClick={openCreateChannel}>
                <Image src={addButton} alt="Add" width={40} height={40} />
              </button>
              {createNewChannel && <NewChannel closePopUp={closeCreateChannel}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SidebarChat: React.FC<{ avatarUrl: string; fallback: string; nickname: string }> = ({ avatarUrl, fallback, nickname }) => {
  return (
    <div className='hover:bg-slate-500 h-20 bg-slate-900 flex items-center justify-start border-t border-b border-gray-500'>
      <Avatar className='h-9 w-9 ml-4 mr-4'>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <span className='w-full overflow-hidden'>{nickname}</span>
    </div>
  )
}

export default Sidebar;
