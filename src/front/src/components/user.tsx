/* eslint-disable @next/next/no-async-client-component */
"use client"

import React, { useState, useEffect } from 'react';
import styles from './style/profile.module.css';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { UserProfileCard, MatchHistoryCard } from './profile';
import { UserProfileCardProps, MatchHistory } from './profile';

const fetchUserData = (username: string): Promise<UserProfileCardProps> => {
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
      console.log("data user: ", data);
      const resolvedData = {...data.getUser, realname: `${data.getUser.firstName} ${data.getUser.lastName}`};
      resolve(resolvedData as UserProfileCardProps);
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
      console.log("data history", data);
      resolve(data.getUserMatchHistory as MatchHistory[]);
    }).catch(error => {
      console.error("Error fetching user matchHistory:", error);
      reject(error);
    });
  });
};

const UserComponent = (props: {username: string}) => {
  const [user, setUser] = useState<UserProfileCardProps>();
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>();
  const username = props.username;
  useEffect(() => {
    const fetchUser = async (username: string) => {
      try {
        const userData = await fetchUserData(username as string);
        console.log("🚀 ~ fetchUser ~ userData:", userData)
        setUser(userData);
      } catch (error) {
        throw(error);
      }
    };

    console.log("toto");
    fetchUser(username as string);
    console.log("user", user);
  }, [username]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      if (user) {
        try {
          const data = await fetchMatchHistoryData(user.id);
          console.log("🚀 ~ fetchMatchHistory ~ data:", data)
          setMatchHistory(data);
        } catch (error) {
          console.error("Error fetching match history:", error);
        }
      }
    };
    console.log("tata");
    fetchMatchHistory();
    console.log("matchHistory", matchHistory);
  }, [user]);


  
  if (user) {
    return (
      user && matchHistory && (
        <div className={styles.container}>
          <UserProfileCard user={user} matchHistory={matchHistory} />
          <MatchHistoryCard user={user} matchHistory={matchHistory} />
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