"use client";
import Sidebar from "@/components/chat/sidebar";
import Conversation from "@/components/chat/conversation";
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './userProvider';
import Loading from "./ui/loading";

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

export const Chat = () => {
  const { user } = useContext(UserContext);
  const [activeConv, setActiveConv] = useState<Chat>();
  const [convType, setConvType] = useState<string>('Friends');
  const [rifresh, setRifresh]  = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const changeConv = (ChatName: Chat) => {
    setActiveConv(ChatName);
  }

  const changeConvType = (newType: string) => {
    setConvType(newType);
  }

  const refresh = () => {
    setRifresh(!rifresh);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);


  if (user && user.id) {
    return (
      <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center">
        <Sidebar changeConv={changeConv} changeConvType={changeConvType} refresh={rifresh}/>
        {activeConv ? (
          <Conversation className="col-span-6" activeConv={activeConv} convType={convType} refresh={refresh} />
        ) : (
            <></>
          )}
      </div>
    );
  } else {
    if ((!loading && !user) || (!loading && user && user.id === null)) {
      return (
        <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
          <div className="h-full flex items-center justify-center text-4xl">You need to be logged in to play</div>
        </div>
      );
    } else {
      return (
        <Loading />
      );
    }
  }
}
