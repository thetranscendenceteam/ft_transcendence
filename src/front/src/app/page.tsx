import {Chat} from "@/components/chat"
import {Game} from "@/components/game"
import {Board} from "@/components/board"

export default function Home() {
  return (
    <main className="grid grid-cols-4 grid-rows-4 h-full">
      <div className='col-span-1 row-span-4'>
        <Chat/>
      </div>
      <div className='col-span-3 row-span-3'>
        <Game/>
      </div>
      <div className='col-span-3 row-span-1'>
        <Board/>
      </div>
    </main>
  )
}
