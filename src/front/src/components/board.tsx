import React from 'react'
import './board/styles.css';

export const Board = () => {
  return (
    <div className="h-full w-full flex grid grid-cols-7 items-center justify-center border-2 border-dashed rounded-lg">
      <div className="h-full border-2 border-dashed">Options</div>
      <div className="h-4/6 col-span-6 col-start-3 col-end-7 grid grid-cols-2 scoreboard bg-gray-500">
        <div className="border border-dashed col-span-2">Player</div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
        <div className="border border-dashed"></div>
      </div>
    </div>
  )
}

export default Board;
