"use client";
import Sidebar, { userData } from "@/components/chat/sidebar";
import Conversation from "@/components/chat/conversation";
import React, { useEffect, useState } from 'react';

export const Chat = (props : {}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<userData[]>([]);

  useEffect(() => {
    // Create new WebSocket connection
    const socket = new WebSocket('ws://127.0.0.1:8000');

    // Connection opened
    socket.addEventListener('open', function (event) {
      console.log('Connected to WS Server');
      socket.send("fetching data...");
    });

    // Listen for Messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        const data = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, ...data]);
    });

    // Listen for possible errors
    socket.addEventListener('error', function (event) {
        console.log('WebSocket error: ', event);
      });
     
    // Set WebSocket in state 
    setWs(socket);

    // Clean up on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.log('WebSocket is not open. Message not sent:', message);
    }
  };

  return (
    <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
      <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center">
        <Sidebar data={messages}/>
        <Conversation className="col-span-6"/>
      </div>
    </div>
  )
}
