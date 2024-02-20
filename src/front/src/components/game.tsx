"use client";
import React, { useContext, useEffect, useRef, useState} from 'react';
import GameEngine from '../lib/game/GameEngine';
import { Button } from './ui/button';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { UserContext } from './userProvider';

export const Game = (
  {gameParams = null, matchId, userId = '', reset = null, watch=true}: {
  gameParams: {rounds: number, difficulty: string, local: boolean} | null,
  matchId: string,
  userId: string,
  reset: Function | null,
  watch: boolean,
}) => {
  const gameRef: any = useRef(null);
  const gameEngine: any = useRef(null);
  const [menu, setMenu] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(function launchGame() {
    if (! gameRef.current || ! setMenu || ! confetti)
      return ;
    if (gameEngine.current)
      return ;
    gameEngine.current = new GameEngine();
    gameEngine.current.init(gameRef, gameParams, matchId, userId, setMenu);
    gameEngine.current.launch();

    return function cleanup() {
      if (gameEngine.current) {
        gameEngine.current.stop();
        gameEngine.current.closeWs();
      }
    }
  }, [gameRef, gameParams, matchId, userId, setMenu]);

  useEffect(function handleKeys() {
    if ( watch ) return ;
    document.addEventListener('keydown', (e) => gameEngine.current.handleKeyDown(e, gameEngine.current));
    document.addEventListener('keyup', (e) => gameEngine.current.handleKeyUp(e, gameEngine.current));
 
    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', gameEngine.current.handleKeyDown);
      document.removeEventListener('keyup', gameEngine.current.handleKeyUp);
    }
  }, [gameEngine, watch]);

  return (
    <div className="h-full flex items-center justify-center rounded-lg backdrop-blur">
      <canvas ref={gameRef} className="bg-gray-950"></canvas>
      {menu && !watch && reset &&
        <div className="absolute left-0 w-full h-full flex items-center justify-center">
          <div className="bg-gray-800 mt-[30%] rounded-lg">
            <Button className='m-4' onClick={() => reset(false)}>New game</Button>
            <Link href='/'><Button className='m-4'>Home</Button></Link>
          </div>
        </div>
      }
    </div>
  )
}
