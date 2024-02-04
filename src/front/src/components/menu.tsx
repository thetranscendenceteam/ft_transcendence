"use client";
import * as React from 'react'
import Link from "next/link"
import Image from "next/image"

import { LoginDialog } from '@/components/login-dialog'
import { Button } from "@/components/ui/button"
import { RegisterDialog } from '@/components/register-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropDownMenu";
import { UserContext } from './userProvider';
import styles from './menu/menu.module.css';
import MenuLink from './ui/menuLink';

const Menu = () => {
  const {user, updateUser} = React.useContext(UserContext);

  React.useEffect(() => {
    let userStorage = window.sessionStorage.getItem("user");
    if (!user && userStorage) {
      updateUser(JSON.parse(userStorage));
    }
  }, [])
  return (
    <header className="sticky top-0 w-full h-14 backdrop-blur-lg backdrop-brightness-75 flex p-4 text-center text-slate-50">
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
        {!user &&
          <div className='flex items-center justify-end'>
            <li className='m-1'>
              <RegisterDialog />
            </li>
            <li className='m-1'>
              <LoginDialog />
            </li>
          </div>
        }
        {user &&
          <li className='m-1'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className='h-8 w-8' style={{ objectFit: 'cover' }}>
                  <AvatarImage src={user.avatar_url as string} />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <MenuLink href="/profile">My Profile</MenuLink>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        }

      </menu>
    </header>
  )
}

export { Menu };
