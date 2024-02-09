import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { gql } from "@apollo/client";
import Image from "next/image";
import apolloClient from "./apolloclient";
import styles from './profile/profile.module.css';
import { useContext } from "react";
import { UserContext } from "./userProvider";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import React from "react";

const LoginDialog = () => {
  const { updateUser } = useContext(UserContext);
  const NEXT_PUBLIC_CLIENT_ID = "u-s4t2ud-b732bcb13d06d5351f1864cdd7f3a8843ba12fcbe1b3080c494e8cc96d4cd7c7";
  const NEXT_PUBLIC_OAUTH_URL = "https://api.intra.42.fr/oauth/authorize";
  const NEXT_PUBLIC_REDIRECT = "https://localhost:8443/callback&response_type=code";
  const CLIENT_SECRET = "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";
  // .env not working, using this temporary. do not commit id and secret ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later
  const ft_auth = NEXT_PUBLIC_OAUTH_URL + '?client_id=' + NEXT_PUBLIC_CLIENT_ID + '&redirect_uri=' + NEXT_PUBLIC_REDIRECT;

  const handleLogin = async () => {
    loadDevMessages();
    loadErrorMessages();
    console.log('login');
    const username: HTMLInputElement = document.getElementById("username") as HTMLInputElement;
    const password: HTMLInputElement = document.getElementById("password") as HTMLInputElement;
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation standardLogin($standardLoginInput: StandardLoginInput!) {
            standardLogin(standardLogin: $standardLoginInput) {
              id
              username
              realname
              email
              avatar_url
              campus
              jwtToken
            }
          }
        `,
        variables: {
          standardLoginInput: {
            username: username.value,
            password: password.value,
          },
        },
      });
  
      if (data) {
        const { id, username, realname, avatar_url, email, campus }  = data.standardLogin;
        updateUser({ id, username, realname, avatar_url, email, campus });
      }
  
    } catch (e) {
      console.error('Error login standard:', e);
    }
      
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="black">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-72">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="foo bar"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className={styles.button} type="submit" onClick={handleLogin}>Login</Button>
        </DialogFooter>
        <div className="flex items-center">
          <hr className="flex-1"/>
          <p className="m-2">or</p> 
          <hr className="flex-1"/>
        </div>
        <Button className="flex align-middle" onClick={() => (window.location.href = ft_auth as string)}>
          Login with
          <Image src="/42_Logo.svg" height={30} width={30} alt="42 logo" className="ml-2"/>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export { LoginDialog }
