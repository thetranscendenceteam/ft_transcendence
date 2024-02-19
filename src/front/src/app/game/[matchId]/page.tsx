"use client";
import { Game } from '@/components/game';
import { gql } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/components/userProvider';
import apolloClient from '@/components/apolloclient';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';

const USER_IN_MATCH = gql`
  query isUserInMatch($userId: String!) {
    isUserInMatch(userId: $userId)
  }
`;

function queryUserMatch(userId: string) {
  return apolloClient.query({
    query: USER_IN_MATCH,
    variables: {
      userId,
    },
  });
}

const GET_ONGOING_MATCHES = gql`
  query getMatches {
    findUngoingMatches {
      id
    }
  }
`;

function queryOngoingMatches() {
  return apolloClient.query({
    query: GET_ONGOING_MATCHES,
  });
}

function Page({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [match, setMatch] = useState<string | null>(null);
  const [game, setGame] = useState<boolean>(true);
  let [watch, setWatch] = useState<boolean>(true);
  
  // Check if user is in a match an if the match matches the matchId
  // If yes, display the game
  // If no, check if there is an ongoing match
  // If yes, display the game as watcher
  // If no, redirect to the /game page

  useEffect(() => {
    if (!apolloClient)
      return;
    console.log('user', user);
    if (user && user.id) {
      queryUserMatch(user.id).then((result) => {
        let m;
        if (result.data && result.data.isUserInMatch && result.data.isUserInMatch === params.matchId) {
          setMatch(result.data.isUserInMatch);
          setWatch(false);
          watch = false;
          return;
        } else {
          queryOngoingMatches().then((result) => {
            if (
              result &&
              (m = result.data.findUngoingMatches.find((m: any) => m.id === params.matchId))
            ) {
              setMatch(m);
              return;
            } else {
              router.push('/game');
            }
          });
        }
      });
    }
  }, [user, params.matchId, router]);

  useEffect(() => {
    if (user && match) {
      setGame(true);
    }
  }, [user, match]);


  useEffect(() => {
    if (game)
      return;
    setGame(false);
    setMatch(null);
    router.push('/game');
  }, [game]);

  if (game && match && user) {
    return <Game matchId={match} gameParams={null} userId={user.id} watch={watch} reset={setGame} />;
  }
  else {
    return <Loading />;
  }
}

export default Page;
