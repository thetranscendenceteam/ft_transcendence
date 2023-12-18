"use client";
import React, { useEffect, useRef, useState} from 'react'
import GameEngine from '../lib/game/GameEngine'

export const Game = () => {

  const [gameStart, setGameStart] = useState(null);
  const gameRef: any = useRef(null);
  const gameEngine: any = useRef(null);

  
  useEffect(function launchGame() {
    if ( ! gameStart )
      return ;
    if (! gameRef.current)
      return ;
    if (gameEngine.current)
      return ;
    console.log("launching game");
    gameEngine.current = new GameEngine();
    gameEngine.current.init(gameRef);
    gameEngine.current.start();
  }, [gameRef, gameStart]);

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
