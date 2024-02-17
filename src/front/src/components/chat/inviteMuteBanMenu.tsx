import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import apolloClient from "../apolloclient";
import { gql } from "@apollo/client";
import { UserContext } from '../userProvider';

interface PopUpProp {
  closeInviteMuteBanMenu: () => void;
  mode: string;
  activeConv: Chat;
}

type Chat = {
  id: string;
  name: string;
  role: string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

type Player = {
  id: string;
  nickname: string;
  avatar: string;
}

const InviteMuteBanMenu: FunctionComponent<PopUpProp> = ({ closeInviteMuteBanMenu, mode, activeConv }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [upgrade, setUpgrade] = useState<boolean>(true);
  const { user } = useContext(UserContext);

  const leaveChat = async(player: Player) => {
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation removeUserOfChat($input: RemoveUserInput!) {
            removeUserOfChat(removeUser: $input)
          }
        `,
        variables: {
          input: {
            chatId: activeConv.id,
            userId: player.id
          }
        }
      });
    } catch (error) {
      return ([]);
    }
  }

  const banMuteFromChat = async (player: Player, status: string) => {
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation addInBanList($input: AddInBanList!) {
            addInBanList(addInBanListInput: $input)
          }
        `,
        variables: {
          input: {
            chatId: activeConv.id,
            userId: player.id,
            status: status
          }
        }
      });
    } catch (error) {
      return ([]);
    }
  }

  const updateSomeoneInChat = async(player: Player, role: string) => {
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateUserInChat($input: UpdateUserInChat!) {
            updateUserInChat(addUserInChat: $input) {
              pseudo
            }
          }
        `,
        variables: {
          input: {
            userId: player.id,
            chatId: activeConv.id,
            role: role
          }
        }
      });
    } catch (error) {
      return ([]);
    }
  }

  const fetchData = async() => {
    try {
      const { data } = await apolloClient.query({
        query: gql`
          query getUsersByIdChat($chatId: String!) {
            getUsersByIdChat(chatId: $chatId) {
              idUser 
              pseudo
              avatar
            }
          }
        `,
        variables: {
          chatId: activeConv.id
        }
      });
      return (data.getUsersByIdChat);
    } catch (error) {
      return ([]);
    }
  }

  const fetchFriends = async () => {
    if (user) {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query getUserRelationship($input: String!) {
              getUserRelationship(userId: $input) {
                relationId
                relationUsername
                avatar
                status
              }
            }
          `,
          variables: {
            input: user.id
          }
        })
        return (data.getUserRelationship);
      } catch (error) {
        return ([]);
      }
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      if (mode === 'Add') {
        const fetchedData = await fetchFriends();
        console.log("FETCHED : ", fetchedData);
        const tmp = fetchedData.map((item: any) => ({
          id: item.relationId,
          nickname: item.relationUsername,
          avatar: item.avatar
        }));
        setPlayers(tmp);
      } else {
        const fetchedData = await fetchData();
        const tmp = fetchedData.map((item: any) => ({
          id: item.idUser,
          nickname: item.pseudo,
          avatar: item.avatar
        }));
        setPlayers(tmp);
      }
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

  const actionButton = (player: Player | null) => {
    if (mode === 'Kick' && player) {
      leaveChat(player);
    } else if (mode === 'Ban' && player) {
      banMuteFromChat(player, 'banned');
      leaveChat(player);
    } else if (mode === 'Mute' && player) {
      banMuteFromChat(player, 'muted');
    } else if (mode === 'Add' && player) {
      updateSomeoneInChat(player, 'member');
    } else if (mode === 'Set Admin' && player) {
      if (upgrade) {
        updateSomeoneInChat(player, 'admin');
      }
      else {
        updateSomeoneInChat(player, 'member');
      }
    }
    if (player) {
      closeInviteMuteBanMenu();
    }
  };

  const upgradeRemove = (change: boolean) => {
    setUpgrade(change);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-1/2 w-1/2 bg-indigo-900 flex flex-col items-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closeInviteMuteBanMenu}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h1 className="absolute top-6 text-3xl mb-6">
          {mode === 'Add' && 'Add someone to the channel!'}
          {mode === 'Ban' && 'Ban someone from the channel.'}
          {mode === 'Kick' && 'Kick someone from the channel.'}
          {mode === 'Mute' && 'Mute someone from the channel.'}
          {mode === 'Set Admin' && 'Change privileges.'}
        </h1>
          {mode === 'Set Admin' && (
            <div className="flex mt-20">
              <button onClick={() => upgradeRemove(true)}
                className={`px-4 py-2 mr-4 border rounded-md 
                  ${upgrade ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white'}
                `}
              >
                  Set as Admin
              </button>
              <button onClick={() => upgradeRemove(false)}
                className={`px-4 py-2 ml-4 border rounded-md 
                  ${upgrade ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}
                `}
              >
                Remove Admin Privileges
              </button>
            </div>
          )}
        <div className="overflow-y-auto absolute top-40">
          <select 
            className="bg-white rounded-md px-4 mb-5 py-2 text-gray-900 origin-top"
            onChange={(e) =>{
              const playerId = e.target.value;
              const selected = players.find((player) => player.nickname === playerId);
              setSelectedPlayer(selected || null);
            }}
          >
            <option value="" disabled selected>Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.nickname}>{player.nickname}</option>
            ))}
          </select>
        </div>
        {selectedPlayer && (
          <div className="absolute bottom-16 mt-4">
            <img src={selectedPlayer.avatar} alt={selectedPlayer.nickname} className="w-16 h-16 rounded-full" />
            <p className="text-xl mt-2">{selectedPlayer.nickname}</p>
          </div>
        )}
        <button className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() =>  actionButton(selectedPlayer)}>
          {mode === 'Invite' && 'Invite'}
          {mode === 'Ban' && 'Ban'}
          {mode === 'Kick' && 'Kick'}
          {mode === 'Mute' && 'Mute'}
          {mode === 'Set Admin' && 'Change'}
          {mode === 'Add' && 'Add'}
        </button>
      </div>
    </div>
  );
}

export default InviteMuteBanMenu;
