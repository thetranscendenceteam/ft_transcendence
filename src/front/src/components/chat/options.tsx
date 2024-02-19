import React, { forwardRef, useState, useContext } from 'react';
import InviteMuteBanMenu from './inviteMuteBanMenu';
import { gql } from "@apollo/client"
import apolloClient from "../apolloclient";
import { UserContext } from '../userProvider';
import { GameDialog } from '../game-dialog';
import { User } from '@/lib/user';

type Chat = {
  id: string;
  targetId: string;
  name: string;
  role: string;
  status: string;
  isPrivate: boolean;
  isWhisper: boolean;
  avatar: string;
}

type Props = {
  convType: string;
  toggleMenu: () => void;
  activeConv: Chat;
  refresh: () => void;
};

const Options = forwardRef<HTMLDivElement, Props>(({ convType, toggleMenu, activeConv, refresh }, ref) => {
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
      toggleMenu();
      refresh();
    }
  }

  const addBlock = async(userId: string, targetId: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation addBlocked($input: RelationshipInput!) {
            addBlocked(relationshipInput: $input)
          }
        `,
        variables: {
          input: {
            userId: userId,
            targetId: targetId
          }
        }
      });
    } catch (error) {
      return ([]);
    }
    refresh();
  }

  const removeRelationship = async(userId: string, targetId: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation removeRelationship($input: RelationshipInput!) {
            removeRelationship(relationshipInput: $input)
          }
        `,
        variables: {
          input: {
            userId: userId,
            targetId: targetId
          }
        }
      });
    } catch (error) {
      return ([]);
    }
  }

  const redirectToUser = (username: string) => {
    window.location.href = `/user/${username}`;
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

  const block = (userId: string, targetId: string) => {
    removeRelationship(userId, targetId);
    addBlock(userId, targetId);
  }

  const sendGameInvite = async (user: User, target: Chat, chatId: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation createMatch($createMatchInput: CreateMatchInput!) {
            createMatch(createMatchInput: $createMatchInput) {
              id
            }
          }
        `,
        variables: {
          createMatchInput: {
            difficulty: 'normal',
            bestOf: 3,
          },
        }
      });

      if (data && data.createMatch) {
        const matchId = data.createMatch.id;

        try {
          await apolloClient.mutate({
            mutation: gql`
              mutation addUserInMatch($addUserInMatch: AddUserInMatch!) {
                addUserInMatch(addUserInMatch: $addUserInMatch) {
                  id
                }
              }
            `,
            variables: {
              addUserInMatch: {
                matchId: String(matchId),
                userId: String(user.id),
              },
            }
          });
          await apolloClient.mutate({
            mutation: gql`
              mutation addUserInMatch($addUserInMatch: AddUserInMatch!) {
                addUserInMatch(addUserInMatch: $addUserInMatch) {
                  id
                }
              }
            `,
            variables: {
              addUserInMatch: {
                matchId: String(matchId),
                userId: String(target.targetId),
              },
            }
          });
          try {
            await apolloClient.mutate({
              mutation: gql`
                mutation AddMessage($input: SendMessageInput!) {
                  addMessage(message: $input)
                }
              `,
              variables: {
                input: {
                  message: "Game Invite",
                  username: user.username,
                  chatId: chatId,
                  link: `/game/${matchId}`
                }
              }
            });
          } catch (error) {
            console.error("Error senging message:", error);
          }

        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div ref={ref} className="absolute top-10 right-1">
      {isInviteMuteBan ? (
        <InviteMuteBanMenu closeInviteMuteBanMenu={closeInviteMuteBanMenu} mode={mode} activeConv={activeConv} />
      ) : (
        <ul className="border border-gray-300 rounded-xl flex flex-col text-gray-600 h-50 bg-white hover:border-gray-400">
          {user && convType === 'Friends' && (
            <>
              <button onClick={() => sendGameInvite(user, activeConv, activeConv.id)}><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Play with</li></button>
              <button onClick={() => block(user.id, activeConv.targetId)}><li className="hover:bg-gray-200 pl-5 pr-7">Block</li></button>
              <button onClick={() => redirectToUser(activeConv.name)}><li className="rounded-b-xl hover:bg-gray-200 pl-5 pr-7">View Profile</li></button>
            </>
          )}
          {convType === 'Channels' && (
            <>
              {(activeConv.role === 'admin' || activeConv.role === 'owner') && (
                <>
                  <button onClick={() => openInviteMuteBanMenu('Ban')}><li className="rounded-t-xl hover:bg-gray-200 pl-5 pr-7">Ban</li></button>
                  <button onClick={() => openInviteMuteBanMenu('Kick')}><li className="hover:bg-gray-200 pl-5 pr-7">Kick</li></button>
                  <button onClick={() => openInviteMuteBanMenu('Mute')}><li className="hover:bg-gray-200 pl-5 pr-7">Mute</li></button>
                  <button onClick={() => openInviteMuteBanMenu('Set Admin')}><li className="hover:bg-gray-200 pl-5 pr-7">Set Admin</li></button>
                </>
              )}
              <button onClick={() => openInviteMuteBanMenu('Add')}><li className={`hover:bg-gray-200 pl-5 pr-7 ${activeConv.role === 'member' ? 'rounded-t-xl' : ''}`}>Add</li></button>
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
