"use client";
import React, { useEffect, useRef, useState } from 'react'
import Palet from '@/components/game/palet';
import Ball from '@/components/game/ball';

type GameState = {
  height: number,
  width: number,
  ready: boolean,
}

export const Game = () => {
  const ws: any = useRef(null)
  const [isWsReady, setIsWsReady] = useState(false)
  const inputRef: any = useRef(null)
  const boardRef: any = useRef(null)
  const [game, setGame] = useState<GameState>({height: 0, width: 0, ready: false});
  const [player, setPlayer] = useState({x: 0, y: 0});
  const pd: any = useRef(0);
  const [ball, setBall] = useState({x: 0, y: 0});

  useEffect(function initWs() {
    const socket: WebSocket = new WebSocket("ws://127.0.0.1:8000")

    // Connection opened
    socket.onopen = () => {
      socket.send("Connection established")
      setIsWsReady(true);
      console.log("i " + boardRef.current.clientWidth + " " + boardRef.current.clientHeight);
      socket.send("i " + boardRef.current.clientWidth + " " + boardRef.current.clientHeight);
    }

    socket.onmessage = (event) => {
      console.log("Message from server ", event.data)
    }

    ws.current = socket;

    return
  }, [])

  useEffect(function initGame() {
    if (boardRef) {
      setGame({
        height: boardRef.current.clientHeight,
        width: boardRef.current.clientWidth,
        ready: true,
      });
    }
  }, [boardRef])

  useEffect(function initPlayer() {
    setPlayer({
      x: game.width,
      y: game.height / 2,
    });
  }, [game])

  let ballxspeed = 2;
  let ballyspeed = 2;

  function runGame() {
    if ((ball.x + ballxspeed) < 0 || ball.x + ballxspeed > game.width)
      ballxspeed = -ballxspeed;
    if ((ball.y + ballyspeed) < 0 || ball.y + ballyspeed > game.height)
      ballyspeed = -ballyspeed;
    //setBall({
    //  x: Math.min(ball.x + ballxspeed, game.width),
    //  y: Math.min(ball.y + ballyspeed, game.height),
    //})
    document.getElementById("ball").style.top = ball.y + "px";
    document.getElementById("ball").style.left = ball.x + "px";
    ball.x += ballxspeed;
    ball.y += ballyspeed;

    if (pd.current == -1)
      player.y = (player.y <= game.height ? player.y + 7 : game.height)
    else if (pd.current == 1)
      player.y = (player.y > 0 ? player.y - 7 : 0);
    //setPlayer({
    //  x: player.x,
    //  y: player.y,
    //})
    document.getElementById("player2").style.top = player.y + "px"; 
  }

  useEffect(() => {

    let interval: any;
    if (game.ready)
      interval = setInterval(runGame, 10);
    
    return () => {
      clearInterval(interval);
    };
  }, [game]);
 

  useEffect(function handleKeys() {
    function handleKeyUp(e:any) {
      if (! isWsReady || ! game.ready)
        return ;
      if (e.keyCode == 40) {
        ws.current.send("c 0");
        pd.current = 0;
      } else if (e.keyCode == 38) {
        ws.current.send("c 0");
        pd.current = 0;
      }
    }
    function handleKeyDown(e:any) {
      if (! isWsReady || ! game.ready)
        return ;
      if (e.keyCode == 40) {
        ws.current.send("c -");
        pd.current = -1
        //setPlayer({ x: player.x, y: (player.y <= game.height ? player.y + 7 : game.height)});
      } else if (e.keyCode == 38) {
        ws.current.send("c +");
        pd.current = +1
        //setPlayer({ x: player.x, y: (player.y > 0 ? player.y - 7 : 0)});
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isWsReady, player]);

  const sendMsg = () => {
    ws.current.send(inputRef.current.value);
    console.log(inputRef.current.value)
    inputRef.current.value = "";
    return;
  }

  if (game.ready)
    return (
      <div ref={boardRef} className="relative h-full border-4 border-dashed rounded-lg bg-gray-950">
        <Ball id="ball" className='absolute' y={ball.y - 4} x={ball.x - 4}/>
        <Palet id="player1" className='absolute' y={game.height/2} x={0}/>
        <Palet id="player2" className='absolute' y={game.height/2} x={player.x - 16}/>
      </div>
    )
  else
    return (
      <div ref={boardRef} className="h-full flex items-center align-middle border-dashed rounded-lg bg-gray-950">
        <h1>Loading game...</h1>
      </div>
    )
}
