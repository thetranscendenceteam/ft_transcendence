"use client";
import Sidebar from "@/components/chat/sidebar";
import Conversation from "@/components/chat/conversation";
import React, { useState } from 'react';

type Chat = {
  id: string;
  name: string;
  avatar: string;
}

export const Chat = () => {
  
  const [activeConv, setActiveConv] = useState<Chat>();
  const [convType, setConvType] = useState<string>('Friends');

  const changeConv = (ChatName: Chat) => {
    setActiveConv(ChatName);
  }

  const changeConvType = (newType: string) => {
    setConvType(newType);
  }

  return (
    <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
      <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center">
        <Sidebar changeConv={changeConv} changeConvType={changeConvType} />
        <Conversation className="col-span-6" activeConv={activeConv} convType={convType}/>
      </div>
    </div>
  )
}
