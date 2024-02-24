"use client";
import React, { useEffect } from 'react'
import {Game} from "@/components/game"
import { GameDialog } from '@/components/game-dialog'
import apolloClient from '@/components/apolloclient';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { UserContext } from '@/components/userProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

const checkUserGame = async (setError: Function, setMatch: Function, userId: String) => {
  try {
    const { data, errors} = await apolloClient.query({
      query: gql`
        query isUserInMatch($userId: String!) {
          isUserInMatch(userId: $userId)
        }
      `,
      variables: {
        userId: userId,
      },
    });
    if (errors) {
      setError(errors[0].message);
    } else {
      setError("");
    }
    if (data && data.isUserInMatch) {
      setMatch(data.isUserInMatch)
    }

    return;
  } catch (error) {
    setError("Invalid credentials");
  }
};

const getNewGame = async (setError: Function, setMatch: Function, gameParams: any, userId: string) => {
  try {
    const { data, errors} = await apolloClient.mutate({
      mutation: gql`
        mutation getMatch($createMatchInput: CreateOrFindMatchInput!) {
          createOrFindMatch(createMatchInput: $createMatchInput)
        }
      `,
      variables: {
        createMatchInput: {
          userId: userId,
          difficulty: gameParams.difficulty,
          bestOf: gameParams.rounds,
        },
      }
    });
    if (errors)
      setError(errors[0].message);
    if (data && data.createOrFindMatch)
      setMatch(data.createOrFindMatch)
  } catch (error) {
    setError("Invalid credentials");
  }
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

const GET_USERS_IN_MATCH = gql`
  query getUsers ($matchId: String!) {
    findUsersInMatch(matchId: $matchId) {
      userId
      username
    }
  }
`;

function queryUsersInMatch(matchId: string) {
  return apolloClient.query({
    query: GET_USERS_IN_MATCH,
    variables: {
      matchId,
    },
  });
}

function Page() {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState(null) as [string | null, Function];
  const [match, setMatch] = useState(null) as [string | null, Function];
  const [game, setGame] = useState(false) as [boolean, Function];
  const [loading, setLoading] = useState(true);
  const [gameParams, setGameParams] = useState(null) as [{rounds: number, difficulty: string, local: boolean} | null, Function];
  let [ongoingMatches, setOngoingMatches] = useState(null) as [any, Function];

  async function handleCheckUserGame(userId: string) {
    await checkUserGame(setError, setMatch, userId);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!apolloClient)
      return;
    if (user && user.id) {
      queryOngoingMatches().then((result) => {
        if (result && result.data && result.data.findUngoingMatches) {
          let matchList = result.data.findUngoingMatches;
          let matchListWithUser = matchList;
          for (let i = 0; i < matchList.length; i++) {
            queryUsersInMatch(matchList[i].id).then((result) => {
              matchListWithUser[i].users = result.data.findUsersInMatch;
              setOngoingMatches(matchListWithUser);
            });
          }
        }
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (user && user.id) {
      handleCheckUserGame( user.id );
    }
  }, [user]);

  useEffect(() => {
    if (gameParams && user) {
      if (gameParams.local) {
        setMatch("local");
        return;
      }
      getNewGame(setError, setMatch, gameParams, user.id);
    }
  }, [gameParams, user]);

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
    setGameParams(null);
  }, [game]);
  
  if (error) {
    router.push('/');
  }
  else if (game && match && match == 'local' && user) {
    return (
      <div className='h-full'>
        <Game gameParams={gameParams} matchId={match} userId={user.id} reset={setGame} watch={false}/>
      </div>
    );
  } else if (user && user.id) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          { (game && match && match != 'local' && user) ?
            <Button variant="black" className="h-auto p-12 rounded-3xl text-7xl" onClick={() => router.push(`/game/${match}`)}>Resume</Button>
          :
            <GameDialog setGameParams={setGameParams} />
          }
          <div className='m-4 p-5 rounded-xl border-black border-2 bg-black'>
            <h1 className='text-center font-bold' >Ongoing matches</h1>
            <ul>
              {ongoingMatches && ongoingMatches.map((m: {id: string, users: {userId: string, username: string}[]}) => (m.users && m.users.length === 2 &&
                <li className='max-h-[20%]:' key={m.id}>
                  <Link className='hover:text-sky-500' href={`/game/${m.id}`}>
                    {m.id === match ? 'Resume' : 'Watch'} {m.users[0].username} vs {m.users[1].username}
                  </Link>
                </li>))}
              {(!ongoingMatches || !ongoingMatches[0] ) && <li>No ongoing matches</li>} 
            </ul>
          </div>
        </div>
      </div>
    )
  }
  else {
    if ((!loading && !user) || (!loading && user && user.id === null)) {
      return (
        <div className="bg-slate-300 h-full w-full bg-blur-sm bg-opacity-50 p-3 rounded-lg">
          <div className="h-full flex items-center justify-center text-4xl">You need to be logged in to play</div>
        </div>
      );
    } else {
      return (
        <Loading />
      );
    }
  }
}

export default Page
