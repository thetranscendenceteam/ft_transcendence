import React, { forwardRef } from 'react';

type Props = {
  activeConvType: string;
};

const Options = forwardRef<HTMLDivElement, Props>(({ activeConvType }, ref) => {
  return (
    <div ref={ref} className="absolute top-10 right-1">
      <ul className="border border-gray-300 rounded-xl flex flex-col text-gray-600 h-50 bg-white hover:border-gray-400">
        {activeConvType === 'Friends' && (
          <>
            <button><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Play with</li></button>
            <button><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Block</li></button>
          </>
        )}
        {activeConvType === 'Channels' && (
          <>
            <button><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Invite</li></button>
            <button><li className="hover:bg-gray-200 pl-5 pr-7">Ban</li></button>
            <button><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Mute</li></button>
          </>
        )}
      </ul>
    </div>
  );
});

Options.displayName = 'Options';

export default Options;
