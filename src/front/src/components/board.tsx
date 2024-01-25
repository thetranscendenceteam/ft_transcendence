import React from 'react'
import './board/styles.css';

export const Board = () => {
const players: { name:string; score: number}[] = [
  { name: 'Player 1', score: 100 },
  { name: 'Player 2', score: 95 },
  { name: 'Player 3', score: 85 },
  { name: 'Player 4', score: 75 },
  { name: 'Player 5', score: 65 },
  { name: 'Player 6', score: 55 },
  { name: 'Player 7', score: 45 },
  { name: 'Player 8', score: 35 },
  { name: 'Player 9', score: 25 },
  { name: 'Player 10', score: 15 },
];

return (
  <div className="h-full w-full flex grid grid-cols-7 items-center justify-center border-2 border-dashed rounded-lg">
    <div className="h-full border-2 border-dashed">Options</div>
    <div className="h-4/6 col-span-6 col-start-3 col-end-7 grid grid-cols-2 scoreboard bg-gray-500">
      <div className="border border-dashed col-span-2 flex items-center justify-center">Player</div>
      {players.map((player, index) => (
        <div key={index} className="border border-dashed flex items-center justify-center">
          <span>{player.name}</span>
          <span className="ml-10">{player.score}</span>
        </div>
      ))}
      <div className="border border-dashed flex items-center justify-center">
        <button className="">Flèche</button>
      </div>
      <div className="border border-dashed flex items-center justify-center">
        <button className="">Flèche 2</button>
      </div>
    </div>
  </div>
)
}

export default Board;
