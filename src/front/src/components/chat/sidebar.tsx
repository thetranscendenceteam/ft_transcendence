import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export type userData = {
  id: number;
  avatarUrl: string;
  fallback: string;
};

type usersData = {
  data: userData[];
};

const Sidebar: React.FC<usersData> = ({ data }) => {
  return (
    <div className='h-full flex flex-col bg-slate-700 rounded-l-lg'>
      <div className='bg-slate-800 h-12 flex items-center justify-center rounded-tl-lg'>
        <h1>Chats</h1>
      </div>
      <div className='h-full flex flex-col overflow-auto'>
        {data.map(conversation => (
          <SidebarChat key={conversation.id} avatarUrl={conversation.avatarUrl} fallback={conversation.fallback} />
        ))}
      </div>
    </div>
  )
}

const SidebarChat: React.FC<{ avatarUrl: string; fallback: string }> = ({ avatarUrl, fallback }) => {
  return (
    <div className='hover:bg-slate-500 h-20 bg-slate-900 flex items-center justify-start border-t border-b border-gray-500'>
      <Avatar className='h-9 w-9 ml-4 mr-4'>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Sidebar;
