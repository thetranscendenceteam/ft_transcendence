"use client"
import React, { useContext } from 'react'
import Pomy from '../../public/pomy.png';
import Image from 'next/image';
import { LoginDialog } from '@/components/login-dialog';
import { RegisterDialog } from '@/components/register-dialog';
import { ButtonVariant } from '../../src/components/register-dialog';
import { UserContext } from '../../src/components/userProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const variant: ButtonVariant = "default";
  const { user } = useContext(UserContext);

  return (
    <main className="h-full w-full flex flex-col items-center justify-center bg-purple-800 opacity-90" style={{ position: 'relative', zIndex: -1 }}>
      <title>Welcome to the game</title>
      <Image src={Pomy} alt='...' height={550} width={550} />
      {user && user.id && (
        <div className="w-full flex justify-center mt-10">
          <Link href="/game" legacyBehavior passHref>
            <Button variant="default" className="mr-6">
              Game
            </Button>
          </Link>
          <Link href="/chat" legacyBehavior passHref>
            <Button variant="default" className="ml-10 mr-6">
              Chat
            </Button>
          </Link>
          <Link href="/board" legacyBehavior passHref>
            <Button variant="default" className="ml-10">
              Leaderboard
            </Button>
          </Link>
        </div>
      )}
      {(!user || (user && !user.id)) &&  (
        <>
          <div className="mt-6 w-full flex justify-center">
            <p className="mr-6 text-3xl">New Here?</p>
            <RegisterDialog variant={variant} />
          </div>
          <div className="mt-6 w-full flex justify-center">
            <p className="mr-6 text-3xl">Already registered:</p>
            <LoginDialog variant={variant} />
          </div>
        </>
      )}
    </main>
  )
}
