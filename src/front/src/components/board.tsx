'use client';
import React, { useState, useEffect, useContext } from 'react';
import apolloClient from "./apolloclient";
import { gql } from "@apollo/client";
import './style/board.css';
import globalIcon from '../../public/global-network.png';
import friendIcon from '../../public/friend.png';
import rightArrow from '../../public/right-arrow.png';
import leftArrow from '../../public/left-arrow.png';
import Image from 'next/image';
import { UserContext } from './userProvider';

const fetchData = async () => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query getUsers($input: Int) {
          getUsers(max: $input) {
            pseudo
            avatar
            xp
          }
        }
      `,
      variables: {
        input: 50 
      }
    });
    return data.getUsers;
  } catch (error) {
    return [];
  }
};

const getPlayer = async (userId: string) => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query getUser($input: GetUserInput!) {
          getUser(UserInput: $input) {
            pseudo
            avatar
            xp
          }
        }
      `,
      variables: {
        input: {
          id: userId
        }
      }
    });
    return (data.getUser);
  } catch (error) {
    return ([]);
  }
};

type Player = {
  pseudo: string;
  avatar: string;
  xp: number;
};

export const Board = () => {
  const [data, setData] = useState<Player[]>([]);
  const [client, setClient] = useState<Player>();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      if (user && user.id) {
        const fetchedClient = await getPlayer(user.id);
        setClient(fetchedClient);
      }
    };

    fetchInitialData();
  }, [user]);

  const getFriends = async () => {
    if (user) {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query friendsLeaderboard($input: String!) {
              friendsLeaderboard(userId: $input) {
                pseudo
                avatar
                xp
              }
            }
          `,
          variables: {
            input: user.id
          }
        });
        return (data.friendsLeaderboard);
      } catch (error) {
        return ([]);
      }
    }
  }

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
  const playersToShow = data ? data.slice(start, end) : [].slice(start, end);

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
    setCurrentPage(1);

    const fetchGlobal = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      if (user && user.id) {
        const fetchedClient = await getPlayer(user.id);
        setClient(fetchedClient);
      }
    };

    fetchGlobal();
  }

  const switchFriendsBoard = () => {
    setCurrentPage(1);

    const fetchFriends = async () => {
      const fetchedData = await getFriends();
      setData(fetchedData);
      if (user && user.id) {
        const fetchedClient = await getPlayer(user.id);
        setClient(fetchedClient);
      }
    };

    fetchFriends();
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
            {client && (
              <>
                <img src={client.avatar} alt="Player profile" className="w-10 h-10 rounded-full mr-6" />
                <span className="mr-5">{client.pseudo}</span>
                <span className="ml-10">{client.xp}</span>
              </>
            )}
          </div>
          {[...Array(10)].map((_,index) => (
            <div key={index} className={`w-full flex items-center ${colors[Math.floor(index / 2)]}`}>
              {playersToShow[index] ? (
                <>
                  <p className="ml-10 text-white text-xl">{index+1}#</p>
                  <img src={playersToShow[index].avatar} alt="Profile" className="rounded-full w-10 h-10 mr-6 ml-4" />
                  <span className="mr-5">{playersToShow[index].pseudo}</span>
                  <span className="ml-10 justify-self-end">{playersToShow[index].xp}</span>
                </>
              ) : (
                <>
                  <div className="h-10"></div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid-item flex justify-between mt-6">
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
