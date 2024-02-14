import React, { forwardRef, useState, useContext } from 'react';
import InviteMuteBanMenu from './inviteMuteBanMenu';
import { gql } from "@apollo/client"
import apolloClient from "../apolloclient";
import { UserContext } from '../userProvider';

type Chat = {
  id: string;
  name: string;
  avatar: string;
}

type Props = {
  convType: string;
  toggleMenu: () => void;
  activeConv: Chat;
};

const Options = forwardRef<HTMLDivElement, Props>(({ convType, toggleMenu, activeConv }, ref) => {
  const [isInviteMuteBan, setIsInviteMuteBan] = useState(false);
  const [mode, setMode] = useState('');
  const { user } = useContext(UserContext);

  const leaveChat = async() => {
    if (user) {
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
              userId: user.id
            }
          }
        });
      } catch (error) {
        return ([]);
      }
      window.location.reload();
      toggleMenu();
    }
  }

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
        <InviteMuteBanMenu closeInviteMuteBanMenu={closeInviteMuteBanMenu} mode={mode} activeConv={activeConv} />
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
              <button onClick={() => openInviteMuteBanMenu('Mute')}><li className="hover:bg-gray-200 pl-5 pr-7">Mute</li></button>
              <button onClick={() => leaveChat()}><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">Leave</li></button>
            </>
          )}
        </ul>
      )}
    </div>
  );
});

Options.displayName = 'Options';

export default Options;
