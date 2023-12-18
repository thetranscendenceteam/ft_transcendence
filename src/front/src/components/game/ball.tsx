"use client";
import React from 'react'

type Ball = {
  x: number,
  y: number,
}

function Ball(props: any) {
  return (
    <div id={props.id} style={{top: (props.y - 6) + "px", left: (props.x - 6) + "px"}} className={props.className + " rounded-full h-3 w-3 bg-white"}></div>
  )
}

export default Ball
