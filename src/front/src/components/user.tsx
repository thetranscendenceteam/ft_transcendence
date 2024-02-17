/* eslint-disable @next/next/no-async-client-component */
"use client"

import React, { useState, useEffect, useContext } from 'react';
import styles from './style/profile.module.css';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { UserProfileCard, MatchHistoryCard } from './profile';
import { UserProfileCardProps, MatchHistory } from './profile';
import { UserContext } from './userProvider';

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
  const [refresh, setRefresh] = useState<boolean>(false);
  const username = props.username;

  const getRelationship = async(userId: string, targetId: string) => {
    try {
      const { data } = await apolloClient.query({
        query: gql`
          query findRelationshipBetweenUsers($input: RelationshipInput!) {
            findRelationshipBetweenUsers(relationshipInput: $input)
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
        console.log("RELATION : ", rel);
        setRelationship(rel);
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
      if (user) {
        try {
          const data = await fetchMatchHistoryData(user.id);
          setMatchHistory(data);
        } catch (error) {
          console.error("Error fetching match history:", error);
        }
      }
    };
    fetchMatchHistory();
  }, [user]);

  const unfriend = () => {
    if (user && target) {
      removeRelationship(user.id, target.id);
      setRefresh(!refresh);
    }
  }

  const addFriend = () => {
    if (user && target) {
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
  
  if (target) {
    return (
      (target && matchHistory) && (
        <div className={styles.container}>
          <div className="w-1/4 flex flex-col">
            <UserProfileCard user={target} matchHistory={matchHistory} />
            {relationship === 'friends' && (
              <>
                <button className="h-24 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={unfriend}>Unfriend</button>
                <button className="h-24 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
              </>
            )}
            {relationship === 'unknown' && (
              <>
                <button className="h-24 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={addFriend}>Add Friend</button>
                <button className="h-24 bg-blue-600 hover:bg-blue-500 ml-6 mt-6 rounded-xl w-80" onClick={block}>Block</button>
              </>
            )}
          </div>
          <MatchHistoryCard user={target} matchHistory={matchHistory} />
        </div>
      )
    );
  }
  return (
    <div className={styles.container}>
      Loading...
    </div>
  );
};

export default UserComponent;
