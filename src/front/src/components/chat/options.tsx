import React, { forwardRef, useState } from 'react';
import InviteMuteBanMenu from './inviteMuteBanMenu';

type Props = {
  convType: string;
  toggleMenu: () => void;
};

const Options = forwardRef<HTMLDivElement, Props>(({ convType, toggleMenu }, ref) => {
  const [isInviteMuteBan, setIsInviteMuteBan] = useState(false);
  const [mode, setMode] = useState('');

  const openInviteMuteBanMenu = (menuType: string) => {
    setMode(menuType);
    setIsInviteMuteBan(true);
  };

  const closeInviteMuteBanMenu = () => {
    setIsInviteMuteBan(false);
    setMode('');
    toggleMenu();
  };

  return (
    <div ref={ref} className="absolute top-10 right-1">
      {isInviteMuteBan ? (
        <InviteMuteBanMenu closeInviteMuteBanMenu={closeInviteMuteBanMenu} mode={mode} />
      ) : (
        <ul className="border border-gray-300 rounded-xl flex flex-col text-gray-600 h-50 bg-white hover:border-gray-400">
          {convType === 'Friends' && (
            <>
              <button onClick={toggleMenu}><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Play with</li></button>
              <button onClick={toggleMenu}><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Block</li></button>
            </>
          )}
          {convType === 'Channels' && (
            <>
              <button onClick={() => openInviteMuteBanMenu('Invite')}><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Invite</li></button>
              <button onClick={() => openInviteMuteBanMenu('Ban')}><li className="hover:bg-gray-200 pl-5 pr-7">Ban</li></button>
              <button onClick={() => openInviteMuteBanMenu('Kick')}><li className="hover:bg-gray-200 pl-5 pr-7">Kick</li></button>
              <button onClick={() => openInviteMuteBanMenu('Mute')}><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Mute</li></button>
            </>
          )}
        </ul>
      )}
    </div>
  );
});

Options.displayName = 'Options';

export default Options;
