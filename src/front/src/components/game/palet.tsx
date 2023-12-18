"use client";
import React from 'react'

type Palet = {
  x: number,
  y: number,
}

function Palet(props: any) {
  return (
    <div id={props.id} style={{top: props.y + "px", left: props.x + "px"}} className={props.className + " rounded-full h-16 w-2 bg-white"}></div>
  )
}

export default Palet
