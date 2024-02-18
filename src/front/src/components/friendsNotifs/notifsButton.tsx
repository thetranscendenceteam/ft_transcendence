import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../userProvider';
import apolloClient from '../apolloclient';
import { gql } from '@apollo/client';

type FriendsNotifs = {
  name: string,
	userId: string,
};

const NotificationsButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotif, setNewNotif] = useState(false);
  const [friendsNotifs, setFriendsNotifs] = useState<FriendsNotifs[]>([]);
  const { user } = useContext(UserContext);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fetchData = async (id: string) => {
    try {
      const { data } = await apolloClient.query({
        query: gql`
					query findPendingRequest($input: String!) {
						findPendingRequest(userId: $input) {
							userId
							username
						}
					}
        `,
        variables: {
          input: id,
        },
      });
      setFriendsNotifs(data.findPendingRequest);
    } catch (error) {
      return [];
    }
  };

  const refuse = async (userId: string) => {
    try {
      await apolloClient.mutate({
        mutation: gql`
					mutation refusePending($acceptOrNot: Boolean!, $relationshipInput: RelationshipInput!) {
						acceptOrRefusePending(acceptOrNot: $acceptOrNot, relationshipInput: $relationshipInput)
					}
        `,
        variables: {
          acceptOrNot: false,
					relationshipInput: {
						userId: user?.id,
						targetId: userId
					}
        },
      });
			if (user) {
				fetchData(user.id);
			}
    } catch (error) {
      return [];
    }
  };

  const accept = async (userId: string) => {
    try {
      await apolloClient.mutate({
        mutation: gql`
					mutation acceptPending($acceptOrNot: Boolean!, $relationshipInput: RelationshipInput!) {
						acceptOrRefusePending(acceptOrNot: $acceptOrNot, relationshipInput: $relationshipInput)
					}
        `,
        variables: {
          acceptOrNot: true,
					relationshipInput: {
						userId: user?.id,
						targetId: userId
					}
        },
      });
			if (user) {
				fetchData(user.id);
			}
    } catch (error) {
      return [];
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setNewNotif(false);
  };

  useEffect(() => {
    if (friendsNotifs.length > 0) {
      setNewNotif(true);
    }
  }, [friendsNotifs]);

  useEffect(() => {
    if (user) {
      fetchData(user.id);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
		<div style={{ position: 'relative', marginLeft: '10px', marginRight: '10px' }}>
			{newNotif ? (
				<button ref={buttonRef} onClick={toggleNotifications}>
					🟢
				</button>
			) : (
				<button ref={buttonRef} onClick={toggleNotifications}>
					⚪
				</button>
			)}
			{showNotifications && (
				<div
					ref={notificationsRef}
					style={{
						position: 'absolute',
						top: buttonRef.current?.offsetTop ?? 0,
						right: 'calc(100% + 10px)',
						backgroundColor: 'white',
						border: '1px solid #24203E',
						borderRadius: '5px',
						padding: '5px',
						background: '#060114',
						color: 'white',
					}}
				>
					{friendsNotifs.length === 0 ? (
						<p style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>No pending friends requests</p>
					) : (
						<ul>
							{friendsNotifs.map((notification: any, index: any) => (
								<div key={index} style={{ marginLeft: '5px', marginRight: '5px' }}>
									<li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
										{notification.username}
										<button style={{ marginLeft: '5px' }} onClick={async () => await refuse(notification.userId)}>
											❌
										</button>
										<button style={{ marginLeft: '5px' }} onClick={async () => await accept(notification.userId)}>
											✅
										</button>
									</li>
								</div>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default NotificationsButton;
