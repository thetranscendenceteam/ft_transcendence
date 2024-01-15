import React from 'react';

type Props = {
  className: string;
}

const Conversation = ({ className }: Props) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center bg-white ${className} rounded-r-lg`}>
      <h1 className="text-black">Conversation</h1>
      <div className="mt-auto w-full mb-2 px-1">
        <input type="text" className="w-full border border-black rounded-lg" placeholder="Type your message here"/>
      </div>
    </div>
  );
};

export default Conversation;
