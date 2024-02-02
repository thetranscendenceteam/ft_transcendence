import React, { FunctionComponent } from 'react';

interface PopUpProp {
  closePopUp: () => void;
}

const NewChannel: FunctionComponent<PopUpProp> = ({ closePopUp }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="h-3/4 w-1/2 bg-[#4d004d] flex items-center justify-center">
        <h2 className="text-2xl">Create New Channel</h2>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={closePopUp}></button>
      </div>
    </div>
  );
}

export default NewChannel;
