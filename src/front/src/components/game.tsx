"use client";
import React, { useEffect, useRef, useState} from 'react'
import GameEngine from '../lib/game/GameEngine'
import { Button } from './ui/button';

export const Game = ({gameParams, matchId, userId}: {gameParams: {rounds: number, difficulty: string, local: boolean}, matchId: string, userId: string}) => {

  const gameRef: any = useRef(null);
  const gameEngine: any = useRef(null);
  const [menu, setMenu] = useState(false);

  useEffect(function launchGame() {
    if (! gameRef.current)
      return ;
    if (gameEngine.current)
      return ;
    console.log("launching game");
    gameEngine.current = new GameEngine();
    gameEngine.current.init(gameRef, gameParams, matchId, userId);
    gameEngine.current.launch();
    console.log("game launched");
  }, [gameRef, gameParams, matchId, userId]);

//  useEffect(function showMenu() {
//    if (! gameEngine.current)
//      return ;
//    console.log(gameEngine.current.state);
//    if (gameEngine.current.state === 'end') {
//      setMenu(true);
//    }
//  }, [gameEngine]);

// 
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
    </div>
  )
}
