import React, { FunctionComponent, useState } from 'react';
import inputImage from '../../../public/image-input.png';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string>('');

  const imageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setSelectedImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const createChannel = () => {
    if (selectedImage) {
      const newConv: Chat = {
        id: channelName,
        name: channelName,
        avatar: selectedImage,
      };
      addChat(newConv); 
    } else {
      const newConv: Chat = {
        id: channelName,
        name: channelName,
        avatar: "https://avatars.githubusercontent.com/u/11646882",
      };
      addChat(newConv);
    }
    closePopUp();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative h-3/4 w-1/2 bg-indigo-900 flex flex-col items-center justify-center rounded-xl">
        <button className="absolute top-2 h-6 w-6 right-2 bg-indigo-900 p-2 flex justify-center items-center text-gray-400 hover:text-gray-500" onClick={closePopUp}>
          <h1 className="text-2xl">x</h1>
        </button>
        <h2 className="absolute top-6 text-3xl mb-6">Create your new channel</h2>
        <form onSubmit={createChannel} className="flex flex-col items-center">
          <label htmlFor="imageInput" className="cursor-pointer">
            {selectedImage ? (
              <div className="w-36 h-36 mb-4 border-4 border-dashed border-gray-300 rounded-full flex justify-center items-center">
                <img src={selectedImage} alt="Selected Image" className="w-24 h-24 rounded-full" />
              </div>
            ) : (
              <div className="w-36 h-36 mb-4 border-4 border-dashed border-gray-300 rounded-full flex justify-center items-center">
                <img src={inputImage.src} alt="Image Input" className="w-16 h-16" />
              </div>
            )}
            <input type="file" id="imageInput" accept="image/*" className="hidden" onChange={imageChange} />
          </label>
          <input type="text" required placeholder="Channel Name" className="text-gray-600 border rounded-md p-2 mt-16" onChange={(e) => setChannelName(e.target.value)} />
          <button type="submit" className="absolute bottom-3 right-3 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600">Create</button>
        </form>
      </div>
    </div>
  );
}

export default NewChannel;
