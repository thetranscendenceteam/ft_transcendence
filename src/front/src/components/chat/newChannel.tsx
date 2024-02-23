import React, { FunctionComponent, useState, useContext } from 'react';
import { gql } from "@apollo/client"
import apolloClient from "../apolloclient";
import { UserContext } from '../userProvider';

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

const NewChannel: FunctionComponent<PopUpProp> = ({ closePopUp, addChat }) => {
  const [channelName, setChannelName] = useState<string>('');
  const { user } = useContext(UserContext);
  const [isPrivate, setIsPrivate] = useState(true);
  const [error, setError] = useState<String | null>(null);

  
  const createChannel = async() => {
    if (channelName === "") {
      return;
    }
    try {
      const { data: { createChat } } = await apolloClient.mutate({
        mutation: gql`
          mutation createChat($input: CreateChatInput!) {
            createChat(createChatInput: $input) {
              id
              name
              isWhisper
            }
          }
        `,
        variables: {
          input: {
            name: channelName,
            isPrivate: isPrivate
          }
        }
      });
      if (createChat && user) {
        const newChat: Chat = {
          id: createChat.id,
          targetId: '',
          name: createChat.name,
          role: 'owner',
          status: 'normal',
          isPrivate: isPrivate,
          isWhisper: createChat.isWhisper,
          avatar: '' 
        };

        const chatId = createChat.id;

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
              chatId: chatId,
              role: 'owner'
            }
          }
        })
        if (data.updateUserInChat.pseudo === user.username) {
          addChat(newChat);
        }
      }
    } catch (error: any) {
      if (error.message && error.message.includes("Unique constraint failed on the fields: (`name`)")) {
      setError("Channel already exists");
      } else {
        setError("An error occured");
      }
      return;
    }
    closePopUp();
  };

  const handlePrivacy = (privacy: boolean) => {
    setIsPrivate(privacy);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-1/2 w-1/2 bg-indigo-900 flex flex-col items-center justify-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closePopUp}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h2 className="absolute top-6 text-5xl mb-6">Create your new channel</h2>
        <input type="text" required placeholder="Channel Name" className="text-gray-600 border rounded-md p-2 mt-16" onChange={(e) => setChannelName(e.target.value)} />
        <div className="flex mt-6">
          <button onClick={() => handlePrivacy(true)}
            className={`px-4 py-2 mr-4 border rounded-md 
              ${isPrivate ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white'}
            `}
          >
              Private
          </button>
          <button onClick={() => handlePrivacy(false)}
            className={`px-4 py-2 ml-4 border rounded-md 
              ${isPrivate ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}
            `}
          >
            Public
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={createChannel}>Create</button>
      </div>
    </div>
  );
}

export default NewChannel;
