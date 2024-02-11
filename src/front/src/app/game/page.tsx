"use client";
import React, { useEffect } from 'react'
import {Game} from "@/components/game"
import { GameDialog } from '@/components/game-dialog'
import apolloClient from '@/components/apolloclient';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { UserContext } from '@/components/userProvider';

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
    else
      console.log("no match found");

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
    if (errors) {
      setError(errors[0].message);
    } else {
      setError("");
    }
    if (data && data.getMatch) {
      setMatch(data.getMatch)
    }
  } catch (error) {
    setError("Invalid credentials");
  }
}

function Page() {
  const { user } = React.useContext(UserContext);
  const [error, setError] = useState("") as [string, Function];
  const [match, setMatch] = useState(null) as [string | null, Function];
  const [gameParams, setGameParams] = useState(null) as [{rounds: number, difficulty: string, local: boolean} | null, Function];

  useEffect(() => {
    if (user) {
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
  }, [gameParams]);
  
  async function handleCheckUserGame(userId: string) {
    await checkUserGame(setError, setMatch, userId);
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  else if (match && user) {
    return (
      <div>
        <p>Match found</p>
        <Game matchId={match} userId={user.id} />
      </div>
    );
    ;
  }
  else if (user){
    return (
      <div className="h-full">
        <GameDialog setGameParams={setGameParams} />
      </div>
    )
  }
  else {
    return <div>Not logged in</div>;
  }
}

export default Page
