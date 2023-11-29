// Want to create a menu component that will be used in the header
import * as React from 'react'
import Link from "next/link"
import Image from "next/image"

import { LoginDialog } from '@/components/login-dialog'
import { Button } from "@/components/ui/button"
import { RegisterDialog } from '@/components/register-dialog'

const Menu = () => {
  return (
    <header className="sticky top-0 w-full h-14 border-b backdrop-blur-lg backdrop-brightness-75 flex p-4 text-center text-slate-50">
      <menu className='flex items-center justify-end w-full'>
        <li className='self-center m-1'>
          <Link href="/" legacyBehavior passHref>
            <Button className='bg-transparent p-1 items-center hover:bg-transparent hover:invert'>
              <Image src="/pong.svg" alt="pong logo" height={30} width={30} className='invert'/>
            </Button>
          </Link>
        </li>
        <li className='m-1'>
          <Link href="/game" legacyBehavior passHref>
            <Button variant="transparent">Game</Button>
          </Link>
        </li>
        <li className='m-1'>
          <Link href="/chat" legacyBehavior passHref>
            <Button variant="transparent">Chat</Button>
          </Link>
        </li>
        <li className='m-1 mr-auto'>
          <Link href="/board" legacyBehavior passHref>
            <Button variant="transparent">Leaderboard</Button>
          </Link>
        </li>
        <li className='m-1'>
          <RegisterDialog />
        </li>
        <li className='m-1'>
          <LoginDialog />
        </li>
      </menu>
    </header>
  )
}

export { Menu };
