"use client"

import React, { useState } from 'react';
import { Card } from './ui/card';
import { UserContext } from './userProvider';
import styles from './style/profile.module.css'; // Ensure the CSS module file is correctly imported
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';

export type UserProfileCardProps = {
  id: string;
  username: string;
  realname: string;
  email: string;
  avatar_url: string | URL;
  campus: string;
};

export interface MatchHistory {
  matchId: string;
  isWin: boolean;
  createdAt: Date;
  userScore: number;
  adversaryScore: number;
  adversaryUsername: string;
}

export interface userAndMatch {
  user: UserProfileCardProps;
  matchHistory: MatchHistory[];
}

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

export const UserProfileCard: React.FC<userAndMatch> = ({ user, matchHistory }: userAndMatch) => {
  const totalMatches = matchHistory.length;
  const winRatio = matchHistory.filter((match) => match.isWin).length / totalMatches * 100;
  if (user.campus === null) user.campus = "Not a 42 Student";
  return (
    <Card className={`${styles.card} ${styles.userProfileCard}`}>
      <img
        src={user.avatar_url as string}
        alt="User Avatar"
        className={styles.avatarImage}
      />
      <h2 className={styles.title}>{user.username}</h2>
      <p className={styles.text}>{user.realname}</p>
      <p className={styles.text}>{user.email}</p>
      <p className={styles.text}>{user.campus === "Not a 42 Student" ? user.campus : "42 " + user.campus}</p>
      <p className={styles.text}>Win ratio: {isNaN(winRatio) ? "0" : winRatio}%</p>
      <p className={styles.text}>Total matches: {totalMatches}</p>
    </Card>
  );
};

export const MatchHistoryCard = ({ user, matchHistory }: userAndMatch) => {
  return (
    <Card className={`${styles.card} ${styles.matchHistoryCard}`}>
      <div className={`${styles.centerCard}`}>
        <Card className={`${styles.titleCard} ${styles.individualCard}`}>
          <div className={styles.gridContainer}>
            <span className="date">Date</span>
            <span className="adversaire">Adversaire</span>
            <span className="Score">Score</span>
            <span className="result">Resultat</span>
          </div>
        </Card>
      </div>
      {matchHistory.map((match, index) => {
        const won = match.isWin;
        const cardColor = won ? styles.greenCard : styles.redCard;
        const date = new Date(match.createdAt).toLocaleDateString("en-US", {month: "long", day: "2-digit", year: "numeric"});
        return (
          <div key={index} className={`${styles.centerCard}`}>
            <Card className={`${cardColor} ${styles.individualCard}`}>
              <div className={styles.gridContainer}>
                <span className="date">{String(date)}</span>
                <span className="adversaire">{match.adversaryUsername}</span>
                <span className="Score">
                  {match.userScore + "-" + match.adversaryScore}
                </span>
                {won ? (
                  <span className="result">Win</span>
                ) : (
                  <span className="result">Loose</span>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </Card>
  );
};



const ProfileComponent = () => {
  const { user } = React.useContext(UserContext);
  const [matchHistory, setMatchHistory] = React.useState<MatchHistory[] | undefined>(undefined);

  React.useEffect(() => {
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

  console.log("USER : ", user);
  console.log("HISTORY : ", matchHistory);
  return (
    user && matchHistory && (
      <div className={styles.container}>
        <div className="w-1/4">
          <UserProfileCard user={user} matchHistory={matchHistory} />
        </div>
        <MatchHistoryCard user={user} matchHistory={matchHistory} />
      </div>
    )
  );
};

export default ProfileComponent;

