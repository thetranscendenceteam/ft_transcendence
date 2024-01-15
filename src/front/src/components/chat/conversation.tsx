import React from 'react';

type Props = {
  className: string;
}

const Conversation = ({ className }: Props) => {
  return (
    <div className={`h-full flex items-center justify-center bg-white ${className}`}>
      <h1 className="text-black">Conversation</h1>
    </div>
  );
};

export default Conversation;
