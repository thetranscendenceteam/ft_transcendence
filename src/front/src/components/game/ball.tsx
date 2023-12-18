"use client";
import React from 'react'

type BallArgs = {
  className: string,
  innerRef: any,
  x: number,
  y: number,
  d: number,
}

function Ball(props: BallArgs) {
  return (
    <div ref={props.innerRef} style={{top: props.y + "px", left: props.x + "px", width: props.d + "px", height: props.d + "px"}} className={props.className + " rounded-full bg-white"}></div>
  )
}

export default Ball
