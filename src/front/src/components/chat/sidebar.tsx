import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function Sidebar() {
  return (
    <div className='h-full flex flex-col rounded-lg bg-slate-700'>
      <div className='bg-slate-800 h-12 rounded-lg flex items-center justify-center'>
        <h1 className='mb-1'>Your chats</h1>
      </div>
      <SidebarChat/>

    </div>
  )
}

function SidebarChat() {
  return (
    <div className='h-12 bg-slate-900 flex items-center justify-start'>
      <Avatar className='h-7 w-7 ml-4 mr-4'>
        <AvatarImage src="https://avatars.githubusercontent.com/u/11646882" />
        <AvatarFallback>LOL</AvatarFallback>
      </Avatar>
      SidebarChat
    </div>
  )
}

export default Sidebar;
