/* eslint-disable @next/next/no-async-client-component */
"use client"

import React, { useState, useEffect, useContext } from 'react';
import styles from './style/profile.module.css';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { UserProfileCard, MatchHistoryCard } from './profile';
import { UserProfileCardProps, MatchHistory } from './profile';
import { UserContext } from './userProvider';
import Loading from './ui/loading';

interface UserData {
  id: string;
  username: string;
  realname: string;
  avatar_url: string;
  email: string;
  campus: string;
}

const fetchTargetData = (username: string): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    apolloClient.query({
      query: gql`
        query getUser($userinput: GetUserInput!){
          getUser (UserInput: $userinput){
            id
            username: pseudo
            firstName
            lastName
            email: mail
            campus
            avatar_url: avatar
          }
        }
      `,
      variables: { userinput: { pseudo: username } },
    }).then(({ data }) => {
      const resolvedData = {...data.getUser, realname: `${data.getUser.firstName} ${data.getUser.lastName}`};
      resolve(resolvedData as UserData);
    }).catch(error => {
      console.error("Error fetching user data:", error);
      reject(error);
    });
  });
};

const fetchMatchHistoryData = (userId: string): Promise<MatchHistory[]> => {
  return new Promise((resolve, reject) => {
    apolloClient.query({
      query: gql`
        query getUserMatchHistory ($userId: String!) {
          getUserMatchHistory (userId: $userId) {
            matchId
            isWin
            createdAt
            userScore
            adversaryScore
            adversaryUsername
          }
        }
      `,
      variables: { userId: userId },
    }).then(({ data }) => {
      resolve(data.getUserMatchHistory as MatchHistory[]);
    }).catch(error => {
      console.error("Error fetching user matchHistory:", error);
      reject(error);
    });
  });
};

const UserComponent = (props: {username: string}) => {
  let [target, setTarget] = useState<UserProfileCardProps>();
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>();
  const { user } = useContext(UserContext);
  const [relationship, setRelationship] = useState<string>();
  const [user1, setUser1] = useState<string>();
  const [user2, setUser2] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const username = props.username;

  const getRelationship = async(userId: string, targetId: string) => {
    try {
      const { data } = await apolloClient.query({
        query: gql`
          query findRelationshipBetweenUsers($input: RelationshipInput!) {
            findRelationshipBetweenUsers(relationshipInput: $input) {
              user1
              user2
              status
            }
          }
        `,
        variables: {
          input: {
            userId: userId,
            targetId: targetId
          }
        }
      });
      return (data.findRelationshipBetweenUsers);
    } catch (error) {
      return ([]);
    }
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
  }

  const mutateAddFriend = async(userId: string, targetId: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation addFriend($input: RelationshipInput!) {
            addFriend(relationshipInput: $input)
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

  const changePending = async(userId: string, targetId: string, accept: boolean) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation acceptOrRefusePending($acceptOrNot: Boolean!, $relationshipInput: RelationshipInput!) {
            acceptOrRefusePending(acceptOrNot: $acceptOrNot, relationshipInput: $relationshipInput)
          }
        `,
        variables: {
          acceptOrNot: accept,
          relationshipInput: {
            userId: userId,
            targetId: targetId
          }
        }
      });
    } catch (error) {
      return ([]);
    }
  }

  useEffect(() => {
    const fetchUser = async (username: string) => {
      try {
        const targetData = await fetchTargetData(username as string);
        const tmp: UserProfileCardProps = {
          id: targetData.id,
          username: targetData.username,
          realname: targetData.realname,
          email: targetData.email,
          avatar_url: targetData.avatar_url,
          campus: targetData.campus
        }
        setTarget(tmp);
        target = tmp;
      } catch (error) {
        throw(error);
      }
    };
    fetchUser(username as string);
  }, [refresh]);

  useEffect(() => {
    if (!target)
      return;
    const fetchRelation = async (userId: string, targetId: string) => {
      try {
        const rel = await getRelationship(userId, targetId);
        setRelationship(rel.status);
        setUser1(rel.user1);
        setUser2(rel.user2);
      } catch (error) {
        throw(error);
      }
    };

    if (user && user.id && target) {
      fetchRelation(user.id, target.id);
    }
  }, [target, user]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      if (target) {
        try {
          const data = await fetchMatchHistoryData(target.id);
          setMatchHistory(data);
        } catch (error) {
          console.error("Error fetching match history:", error);
        }
      }
    };
    fetchMatchHistory();
  }, [target]);

  useEffect(() => {
    if (relationship === 'friends') {
      setStatus('friends');
    } else if (!relationship || relationship === 'unknown') {
      setStatus('unknown');
    } else if (user && relationship === 'block_first_to_second' && user.id === user1) {
      setStatus('has_blocked');
    } else if (user && relationship === 'block_second_to_first' && user.id === user2) {
      setStatus('has_blocked');
    } else if (user && relationship === 'block_first_to_second' && user.id === user2) {
      setStatus('was_blocked');
    } else if (user && relationship === 'block_second_to_first' && user.id === user1) {
      setStatus('was_blocked');
    } else if (user && relationship === 'pending_first_to_second' && user.id === user1) {
      setStatus('has_invited');
    } else if (user && relationship === 'pending_second_to_first' && user.id === user2) {
      setStatus('has_invited');
    } else if (user && relationship === 'pending_first_to_second' && user.id === user2) {
      setStatus('was_invited');
    } else if (user && relationship === 'pending_second_to_first' && user.id === user1) {
      setStatus('was_invited');
    }
  }, [relationship]);

  const addFriend = () => {
    if (user && target) {
      removeRelationship(user.id, target.id);
      mutateAddFriend(user.id, target.id);
      setRefresh(!refresh);
    }
  }

  const block = () => {
    if (user && target) {
      removeRelationship(user.id, target.id);
      addBlock(user.id, target.id);
      setRefresh(!refresh);
    }
  }

  const dealPending = (accept: boolean) => {
    if (user && target) {
      changePending(user.id, target.id, accept);
      setRefresh(!refresh);
    }
  }

  const removeRelation = () => {
    if (user && target) {
      removeRelationship(user.id, target.id);
      setRefresh(!refresh);
    }
  }
  
  if (target && status != "was_blocked") {
    return (
      target && matchHistory && (
        <div className={styles.container}>
          <div className="h-full w-1/4 flex flex-col">
            <UserProfileCard user={target} matchHistory={matchHistory} />
            {user && user.id != target.id && (
              <>
                {status === 'friends' && (
                  <>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={removeRelation}>Unfriend</button>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
                  </>
                )}
                {status === 'unknown' && (
                  <>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={addFriend}>Add Friend</button>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
                  </>
                )}
                {status === 'has_blocked' && (
                  <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={removeRelation}>Unblock</button>
                )}
                {status === 'has_invited' && (
                  <>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={removeRelation}>Cancel Invite</button>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
                  </>
                )}
                {status === 'was_invited' && (
                  <>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={() => dealPending(true)}>Accept invitation</button>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={() => dealPending (false)}>Refuse invitation</button>
                    <button className="h-1/6 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="w-1/2">
            <MatchHistoryCard user={target} matchHistory={matchHistory} />
          </div>
        </div>
      )
    );
  } else if (target && status == 'was_blocked') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-6xl">{target.username} has blocked you</p>
      </div>
    );
  }
  return (
    <Loading />
  );
};

export default UserComponent;
