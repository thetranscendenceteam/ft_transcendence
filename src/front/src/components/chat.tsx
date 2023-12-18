"use client";
import Sidebar from "@/components/chat/sidebar"
import React, { useEffect } from 'react'

export const Chat = (props : {}) => {
  let chats = null 

  useEffect(() => {
    // Fetch data on the client side
    // const fetchData = async () => {
    //   try {
    //     const response: User | any = await getUser(code); // Replace with your API route
    //     if (!response.error) {
    //     //  setData(response);
    //       window.sessionStorage.setItem("user", JSON.stringify(response));
    //       updateUser(response);
    //       router.push('/');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // };
  })
  return (
    <div className="h-full grid grid-cols-7 grid-rows-1 items-center justify-center border-2 border-dashed rounded-lg">
      <Sidebar>
      </Sidebar>
      <h1> Chat </h1>
    </div>
  )
}
