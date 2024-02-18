"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoginDialog } from '@/components/login-dialog';
import { Button } from '@/components/ui/button';
import { RegisterDialog } from '@/components/register-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropDownMenu';
import { UserContext } from './userProvider';
import MenuLink from './ui/menuLink';
import { useRouter } from 'next/navigation';
import { SearchBar } from './searchBar/searchBar';
import { SearchResultsList } from './searchBar/searchResultsList';
import styles from './style/menu.module.css';
import { useCookies } from 'react-cookie';
import NotificationsButton from './friendsNotifs/notifsButton';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/components/apolloclient';

interface User {
  id: string | null;
  username: string | null;
  realname: string | null;
  avatar_url: string | null;
  email: string | null;
  campus: string | null;
}

const Menu: React.FC = () => {
  const { user, updateUser } = React.useContext(UserContext);
  const router = useRouter();
  const [resultsSearch, setResultsSearch] = useState<any[]>([]);
  const [resultsNotif, setResultsNotif] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(true);
  const searchBarRefSearch = useRef<HTMLDivElement>(null);
  const searchBarRefNotif = useRef<HTMLDivElement>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  useEffect(() => {
    function handleClickOutsideSearch(event: MouseEvent) {
      if (searchBarRefSearch.current && !searchBarRefSearch.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  useEffect(() => {
    function handleClickOutsideNotif(event: MouseEvent) {
      if (searchBarRefNotif.current && !searchBarRefNotif.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsideNotif);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotif);
    };
  }, []);

  function handleLogoutClick() {
    removeCookie('jwt');
    updateUser({
      id: null,
      username: null,
      realname: null,
      avatar_url: null,
      email: null,
      campus: null,
    });
    router.push('/');
  }

  return (
    <header className="sticky top-0 w-full backdrop-blur-lg backdrop-brightness-75">
      <div className="flex p-4 text-center text-slate-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" legacyBehavior passHref>
              <Button className="bg-transparent p-1 items-center hover:bg-transparent hover:invert">
                <Image src="/pong.svg" alt="pong logo" height={30} width={30} className="invert" />
              </Button>
            </Link>
            <Link href="/game" legacyBehavior passHref>
              <Button variant="transparent" className="ml-4">
                Game
              </Button>
            </Link>
            <Link href="/chat" legacyBehavior passHref>
              <Button variant="transparent" className="ml-4">
                Chat
              </Button>
            </Link>
            <Link href="/board" legacyBehavior passHref>
              <Button variant="transparent" className="ml-4">
                Leaderboard
              </Button>
            </Link>
          </div>
          <div className={`${styles.searchBarContainer} ml-auto relative`} ref={searchBarRefSearch}>
            <SearchBar setResults={setResultsSearch} setShowResults={setShowResults} />
            {showResults && resultsSearch.length !== 0 ? (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg overflow-hidden">
                <SearchResultsList results={resultsSearch} />
              </div>
            ) : null}
          </div>

          {user?.id ? (
          <ApolloProvider client={apolloClient}>
            <NotificationsButton />
          </ApolloProvider>) : (null)
          }

          {user?.id ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8" style={{ objectFit: 'cover' }}>
                    <AvatarImage src={user.avatar_url as string} />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <MenuLink href="/profile">My Profile</MenuLink>
                  <MenuLink href="/edit_profile">Edit Profile</MenuLink>
                  <MenuLink href="/twoFA">2FA</MenuLink>
                  <DropdownMenuItem onClick={handleLogoutClick}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <div className="flex items-center">
              <RegisterDialog />
              <LoginDialog />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { Menu };
