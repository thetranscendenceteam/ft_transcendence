/* eslint-disable @next/next/no-async-client-component */
"use client"

import React, { useState, useEffect } from 'react';
import styles from './style/profile.module.css';
import { MatchHistoryCard, UserProfileCard } from './profile';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';

interface UserData {
  username: string;
  realname: string;
  email: string;
  avatar: string;
  campus: string;
  avatar_url: string;
}

const fetchData = (username: string): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    apolloClient.query({
      query: gql`
        query getUser($userinput: GetUserInput!){
          getUser (UserInput: $userinput){
            username: pseudo
            firstName
            lastName
            email: mail
            avatar
            campus
            avatar_url: avatar
          }
        }
      `,
      variables: { userinput: { pseudo: username } },
    }).then(({ data }) => {
      console.log("data", data);
      resolve(data.getUser as UserData);
    }).catch(error => {
      console.error("Error fetching user data:", error);
      reject(error);
    });
  });
};

const UserComponent = (props: {username: string}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const username = props.username;
  useEffect(() => {
    const fetchDataAndUpdateState = async (username: string) => {
      try {
        const userData = await fetchData(username as string);
        setUser(userData); ;
      } catch (error) {
        throw(error);
      }
    };

    fetchDataAndUpdateState(username as string);
  }, [username]);

  if (user) {
    return (
      <div className={styles.container}>
        <UserProfileCard user={user} />
        <MatchHistoryCard />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      Loading...
    </div>
  );
};

export default UserComponent;