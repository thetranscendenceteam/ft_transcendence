"use client"

import React from 'react';
import { Card } from './ui/card';
import { UserContext } from './userProvider';
import styles from './profile/profile.module.css'; // Ensure the CSS module file is correctly imported

type UserProfileCardProps = {
  user: {
    username: string;
    realname: string;
    email: string;
    avatar_url: string | URL;
    campus: string;
  };
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
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
      <p className={styles.text}>{"42 " + user.campus}</p>
      <p className={styles.text}>Ranking</p>
      <p className={styles.text}>Win ratio: 0%</p>
      <p className={styles.text}>Total matches: 0</p>
      <button className={styles.button}>Edit Profile</button>
    </Card>
  );
};

const MatchHistoryCard = () => {
  const matchHistory = [
    {
      id: "175",
      creation_date: "2021-01-01",
      score: [
        { id: "4166fbb1-0431-41b5-91b4-ecaf6830ecf7", score: 5 },
        { id: "16374", score: 1 },
      ],
      adversaire: "John Doe",
      winner: "4166fbb1-0431-41b5-91b4-ecaf6830ecf7",
    },
    {
      id: "134",
      creation_date: "2021-01-01",
      score: [
        { id: "4166fbb1-0431-41b5-91b4-ecaf6830ecf7", score: 4 },
        { id: "16374", score: 5 },
      ],
      adversaire: "John Doe",
      winner: "16374",
    },
  ];

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
        const won = match.winner === "16374";
        const cardColor = won ? styles.greenCard : styles.redCard;
        return (
          <div key={index} className={`${styles.centerCard}`}>
            <Card className={`${cardColor} ${styles.individualCard}`}>
              <div className={styles.gridContainer}>
                <span className="date">{match.creation_date}</span>
                <span className="adversaire">{match.adversaire}</span>
                <span className="Score">
                  {match.score[0].score + "-" + match.score[1].score}
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
      <MatchHistoryCard />
    </div>
  );
};

export default ProfileComponent;

