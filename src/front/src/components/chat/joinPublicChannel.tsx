import { FunctionComponent, useContext, useState, useEffect } from 'react';
import { UserContext } from '../userProvider';
import { gql } from "@apollo/client"
import apolloClient from "../apolloclient";

type Chat = {
  id: string;
  targetId: string;
  name: string;
  role:string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

interface PopUpProp {
  closePopUp: () => void;
  addChat: (newConv: Chat) => void;
}

const JoinPublicChannel: FunctionComponent<PopUpProp> = ({ closePopUp, addChat }) => {
  const [channelName, setChannelName] = useState<string>('');
  const { user } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [data, setData]= useState<Chat[]>([]);

  const fetchChats = async () => {
    try {
      const { data } = await apolloClient.query({
        query: gql`
            query getAllChats($input: Int) {
              getAllChats(max: $input) {
                id 
                name
                isPrivate
                isWhisper
              }
            }
        `,
        variables: {
          input: 50 
        }
      });
      return (data.getAllChats);
    } catch (error) {
      return ([]);
    }
  }

  const addUserToChat = async () => {
    if (user && selectedChat) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: gql`
            mutation updateUserInChat($input: UpdateUserInChat!) {
              updateUserInChat(addUserInChat: $input) {
                pseudo
              }
            }
          `,
            variables: {
              input: {
                userId: user.id,
                chatId: selectedChat.id,
                role: 'member'
              }
            }
        })
        if (data.updateUserInChat.pseudo === user.username) {
          addChat(selectedChat);
        }
      } catch (error) {
        return ([]);
      }
    }
  }


  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchChats();
      const tmp = fetchedData.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: 'member',
        status: 'normal',
        isPrivate: item.isPrivate,
        isWhisper: item.isWhisper,
        avatar: ""
      }));
      setData(tmp);
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

  const joinChat = () => {
    if (selectedChat) {
      addUserToChat();
      closePopUp();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-1/3 w-1/2 bg-indigo-900 flex flex-col items-center justify-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closePopUp}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h2 className="absolute top-6 text-5xl mb-6">Join a Public Channel</h2>
        <div className="overflow-y-auto absolute top-40">
          <select 
            className="bg-white rounded-md px-4 mb-5 py-2 text-gray-900 origin-top"
            onChange={(e) =>{
              const playerId = e.target.value;
              const selected = data.find((chat) => chat.name === playerId);
              setSelectedChat(selected || null);
            }}
          >
            <option value="" disabled selected>Select a channel</option>
            {data.map((chat) => (
              <option key={chat.id} value={chat.name}>{chat.name}</option>
            ))}
          </select>
        </div>
        <button className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={joinChat}>Join</button>
      </div>
    </div>
  );
}

export default JoinPublicChannel;
