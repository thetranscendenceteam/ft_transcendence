"use client";
import Sidebar from "@/components/chat/sidebar";
import Conversation from "@/components/chat/conversation";
import React, { useState } from 'react';

export const Chat = () => {
  
  const [activeConvType, setActiveConvType] = useState<string>('');

  const changeConvType = (buttonName: string) => {
    setActiveConvType(buttonName);
  }

  return (
    <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
      <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center">
        <Sidebar changeConvType={changeConvType} />
        <Conversation className="col-span-6" activeConvType={activeConvType} />
      </div>
    </div>
  )
}
