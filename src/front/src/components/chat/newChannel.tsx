import React, { FunctionComponent, useState, useContext } from 'react';
import { gql } from "@apollo/client"
import apolloClient from "../apolloclient";
import { UserContext } from '../userProvider';

type Chat = {
  id: string;
  name: string;
  avatar: string;
}

interface PopUpProp {
  closePopUp: () => void;
  addChat: (newConv: Chat) => void;
}

const NewChannel: FunctionComponent<PopUpProp> = ({ closePopUp, addChat }) => {
  const [channelName, setChannelName] = useState<string>('');
  const { user } = useContext(UserContext);

  
  const createChannel = async() => {
    try {
      const { data: { createChat } } = await apolloClient.mutate({
        mutation: gql`
          mutation createChat($input: CreateChatInput!) {
            createChat(createChatInput: $input) {
              id
              name
            }
          }
        `,
        variables: {
          input: {
            name: channelName,
            isPrivate: false
          }
        }
      });
      if (createChat && user) {
        const newChat: Chat = {
          id: createChat.id,
          name: createChat.name,
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
    } catch (error) {
      console.error("Error senging message:", error);
    }
    closePopUp();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-1/2 w-1/2 bg-indigo-900 flex flex-col items-center justify-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closePopUp}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h2 className="absolute top-6 text-3xl mb-6">Create your new channel</h2>
        <input type="text" required placeholder="Channel Name" className="text-gray-600 border rounded-md p-2 mt-16" onChange={(e) => setChannelName(e.target.value)} />
        <button className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={createChannel}>Create</button>
      </div>
    </div>
  );
}

export default NewChannel;
