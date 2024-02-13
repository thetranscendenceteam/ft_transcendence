"use client";
import React, { useEffect, useRef, useState} from 'react';
import GameEngine from '../lib/game/GameEngine';
import { Button } from './ui/button';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export const Game = (
  {gameParams, matchId, userId, reset}: {
  gameParams: {rounds: number, difficulty: string, local: boolean} | null,
  matchId: string,
  userId: string
  reset: Function
}) => {
  const gameRef: any = useRef(null);
  const gameEngine: any = useRef(null);
  const [menu, setMenu] = useState(false);

  useEffect(function launchGame() {
    if (! gameRef.current || ! setMenu || ! confetti)
      return ;
    if (gameEngine.current)
      return ;
    console.log("launching game");
    gameEngine.current = new GameEngine();
    gameEngine.current.init(gameRef, gameParams, matchId, userId, setMenu);
    gameEngine.current.launch();
    console.log("game launched");
  }, [gameRef, gameParams, matchId, userId, setMenu]);

  useEffect(function handleMenu() {
    if (! menu)
      return ;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      angle: 60,
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      angle: 120,
    });
  }, [menu]);

  useEffect(function handleKeys() {
    document.addEventListener('keydown', (e) => gameEngine.current.handleKeyDown(e, gameEngine.current));
    document.addEventListener('keyup', (e) => gameEngine.current.handleKeyUp(e, gameEngine.current));
 
    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', gameEngine.current.handleKeyDown);
      document.removeEventListener('keyup', gameEngine.current.handleKeyUp);
    }
  }, [gameEngine]);

  return (
    <div className="h-full flex items-center justify-center rounded-lg backdrop-blur">
      <canvas ref={gameRef} className="bg-gray-950"></canvas>
      {menu && 
        <div className="absolute top-[20%] left-0 w-full h-full flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg">
            <Button className='m-4' onClick={() => reset(false)}>Restart</Button>
            <Link href='/'><Button className='m-4'>Home</Button></Link>
          </div>
        </div>
      }
    </div>
  )
}
