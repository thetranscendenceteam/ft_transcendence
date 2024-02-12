"use client"

import React from 'react';
import { Card } from './ui/card';
import { UserContext } from './userProvider';
import styles from './style/profile.module.css'; // Ensure the CSS module file is correctly imported
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';

type UserProfileCardProps = {
  user: {
    id: string;
    username: string;
    realname: string;
    email: string;
    avatar_url: string | URL;
    campus: string;
  };
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <Card className={`${styles.card} ${styles.userProfileCard}`}>
      <img
        src={user.avatar_url as string}
        alt="User Avatar"
        className={styles.avatarImage} // Apply the class for styles
      />
      <h2 className={styles.title}>{user.username}</h2>
      <p className={styles.text}>{user.realname}</p>
      <p className={styles.text}>{user.email}</p>
      <p className={styles.text}>{user.campus === "Not a 42 Student" ? user.campus : "42 " + user.campus}</p>
      <p className={styles.text}>Ranking: Top42</p>
      <p className={styles.text}>Win ratio: 50%</p>
      <p className={styles.text}>Total matches: 2</p>
    </Card>
  );
};

interface MatchHistory {
  matchId: string;
  isWin: boolean;
  createdAt: Date;
  userScore: number;
  adversaryScore: number;
  adversaryUsername: string;
}

export const MatchHistoryCard = async ({ user }: UserProfileCardProps) => {
  const fetchData = (userId: string): Promise<MatchHistory[]> => {
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

  const matchHistory = await fetchData(user.id);

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
  const {user, updateUser} = React.useContext(UserContext);

  React.useEffect(() => {
    let userStorage = window.sessionStorage.getItem("user");
    if (!user && userStorage) {
      updateUser(JSON.parse(userStorage));
    }
  }, []);

  return (
    user && <div className={styles.container}>
      <UserProfileCard user={user} />
      <MatchHistoryCard user={user} />
    </div>
  );
};

export default ProfileComponent;

