'use client';
import React, { useState, useEffect } from 'react';
import apolloClient from "./apolloclient";
import { gql } from "@apollo/client";
import './board/styles.css';
import globalIcon from '../../public/global-network.png';
import friendIcon from '../../public/friend.png';
import rightArrow from '../../public/right-arrow.png';
import leftArrow from '../../public/left-arrow.png';
import Image from 'next/image';

const fetchData = async () => {
  console.log("fetchData");
  try {
    const { data } = await apolloClient.query({
      query: gql`
        {
          getUsers {
            id
            nickname: pseudo
            avatar
            xp
          }
        }
      `,
    });
    console.log("data", data);
    return data.getUsers;
  } catch (error) {
    return [];
  }
};

type Player = {
  id: string;
  nickname: string;
  avatar: string;
  xp: number;
};

export const Board = () => {
  const [data, setData] = useState<Player[]>([]);;

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

  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const playersToShow = data.slice(start, end);

  const colors = ['bg-[#8c1aff]', 'bg-[#8000ff]', 'bg-[#7300e6]', 'bg-[#6600cc]', 'bg-[#5900b3]'];

  const nextPage = () => {
    if (end < data.length) {
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
   
  const switchGlobalBoard = () => {
  }

  const switchFriendsBoard = () => {
    setCurrentPage(1);
  }

  return (
    <div className="h-full w-full flex grid grid-cols-7 items-center justify-center rounded-lg">
      <div className="h-full bg-white flex grid grid-rows-2 grid-cols-1">
        <button className="h-full bg-[#710f71] flex justify-center items-center transition-all duration-300 hover:opacity-60" onClick={switchFriendsBoard}>
          <Image src={friendIcon} alt="Friends" width={120} height={120} />
        </button>
        <button className="bg-[#ac16ac] h-full flex justify-center items-center transition-all duration-300 hover:opacity-60" onClick={switchGlobalBoard}>
          <Image src={globalIcon} alt="Global" width={140} height={140} />
        </button>
      </div>
      <div className="h-4/6 col-span-6 col-start-3 col-end-7 grid grid-rows-7">
        <div className="scoreboard grid grid-cols-2 w-full h-full row-span-6 row-start-1 row-end-7">
          <div className="col-span-2 flex items-center justify-center bg-[#a64dff]">
            <img src="https://avatars.githubusercontent.com/u/11646882" alt="Player profile" className="w-10 h-10 rounded-full mr-6" />
            <span className="mr-5">Player</span>
            <span className="ml-10">3</span>
          </div>
          {[...Array(10)].map((_,index) => (
            <div key={index} className={`w-full flex items-center justify-center ${colors[Math.floor(index / 2)]}`}>
              {playersToShow[index] ? (
                <>
                  <img src={playersToShow[index].avatar} alt="Profile" className="rounded-full w-10 h-10 mr-6" />
                  <span className="mr-5">{playersToShow[index].nickname}</span>
                  <span className="ml-10">{playersToShow[index].xp}</span>
                </>
              ) : (
                <>
                  <div className="h-10"></div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid-item flex justify-between">
          <div className="h-15 w-40 flex items-center justify-center ml-5">
            <button className="" onClick={prevPage}>
              <Image src={leftArrow} alt="Left Arrow" className="h-15 w-40" />
            </button>
          </div>
          <div className="flex items-center justify-center mr-5">
            <button className="" onClick={nextPage}>
              <Image src={rightArrow} alt="Right Arrow" className="m-0 p-0 h-15 w-40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board;
