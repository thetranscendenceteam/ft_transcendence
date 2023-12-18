"use client";
import React from 'react'

type PalletArgs = {
  className: string,
  innerRef: any,
  x: number,
  y: number,
  w: number,
  h: number,
}

function Pallet(props: PalletArgs) {
  return (
    <div ref={props.innerRef}
      style={{top: props.y + "px", left: props.x + "px", width: props.w + "px", height: props.h + "px"}}
      className={props.className + " bg-white"}></div>
  )
}

export default Pallet
