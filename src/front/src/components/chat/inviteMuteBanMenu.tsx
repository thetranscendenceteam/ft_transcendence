import React, { FunctionComponent, useState, useEffect } from 'react';
import apolloClient from "../apolloclient";
import { gql } from "@apollo/client";

interface PopUpProp {
  closeInviteMuteBanMenu: () => void;
  mode: string;
}

type Player = {
  id: string;
  nickname: string;
  avatar: string;
}

const fetchData = async() => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        {
          getUsers {
            id 
            nickname: pseudo
            avatar
          }
        }
      `,
    });
    return (data.getUsers);
  } catch (error) {
    return ([]);
  }
}

const InviteMuteBanMenu: FunctionComponent<PopUpProp> = ({ closeInviteMuteBanMenu, mode }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData();
      setPlayers(fetchedData);
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

  const actionButton = (player: Player) => {
    console.log(player);
    closeInviteMuteBanMenu();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-1/2 w-1/2 bg-indigo-900 flex flex-col items-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closeInviteMuteBanMenu}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h1 className="absolute top-6 text-3xl mb-6">
          {mode === 'Invite' && 'Play a game with someone!'}
          {mode === 'Ban' && 'Ban someone from the channel.'}
          {mode === 'Kick' && 'Kick someone from the channel.'}
          {mode === 'Mute' && 'Mute someone from the channel.'}
        </h1>
        {(mode === 'Mute' || mode === 'Ban') && (
          <div className="flex items-center mt-20">
            <label htmlFor="duration" className="block text-lg mt-3 mr-3">
              Duration in minutes(0 = forever):
            </label>
            <input type="number" min="0" max="1440" id="duration" name="duration" className="w-24 h-8 text-black border rounded-md px-2 mt-2" />
          </div>
        )}
        <div className="overflow-y-auto absolute top-40">
          <select 
            className="bg-white rounded-md px-4 mb-5 py-2 text-gray-900 origin-top"
            onChange={(e) =>{
              const playerId = e.target.value;
              const selected = players.find((player) => player.id === playerId);
              setSelectedPlayer(selected || null);
            }}
          >
            <option value="" disabled selected>Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>{player.nickname}</option>
            ))}
          </select>
        </div>
        {selectedPlayer && (
          <div className="absolute bottom-16 mt-4">
            <img src={selectedPlayer.avatar} alt={selectedPlayer.nickname} className="w-16 h-16 rounded-full" />
            <p className="text-xl mt-2">{selectedPlayer.nickname}</p>
          </div>
        )}
        <button className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() =>  selectedPlayer && actionButton(selectedPlayer)}>
          {mode === 'Invite' && 'Invite'}
          {mode === 'Ban' && 'Ban'}
          {mode === 'Kick' && 'Kick'}
          {mode === 'Mute' && 'Mute'}
        </button>
      </div>
    </div>
  );
}

export default InviteMuteBanMenu;
