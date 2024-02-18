"use client";
import Sidebar from "@/components/chat/sidebar";
import Conversation from "@/components/chat/conversation";
import React, { useState, useContext } from 'react';
import { UserContext } from './userProvider';

type Chat = {
  id: string;
  name: string;
  role: string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

export const Chat = () => {
  const { user } = useContext(UserContext);
  const [activeConv, setActiveConv] = useState<Chat>();
  const [convType, setConvType] = useState<string>('Friends');
  const [rifresh, setRifresh]  = useState<boolean>(false);

  const changeConv = (ChatName: Chat) => {
    setActiveConv(ChatName);
  }

  const changeConvType = (newType: string) => {
    setConvType(newType);
  }
  
  const refresh = () => {
    setRifresh(!rifresh);
  }

  return (
    <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
      {(user && user.id) ? (
        <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center">
          <Sidebar changeConv={changeConv} changeConvType={changeConvType} refresh={rifresh}/>
          {activeConv ? (
            <Conversation className="col-span-6" activeConv={activeConv} convType={convType} refresh={refresh} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-4xl">You need to be logged in to chat</div>
      )}
    </div>
  )
}
