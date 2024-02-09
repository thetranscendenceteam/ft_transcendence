import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gql } from "@apollo/client";
import Image from "next/image";
import apolloClient from "./apolloclient";
import styles from './profile/profile.module.css';
import { useState } from "react";
import { UserContext } from "./userProvider";
import React from "react";
import { useRouter } from 'next/navigation';

const handleLogin = async (setError: Function, updateUser: Function) => {
  const username: HTMLInputElement = document.getElementById("username") as HTMLInputElement;
  const password: HTMLInputElement = document.getElementById("password") as HTMLInputElement;
  const twoFA: HTMLInputElement = document.getElementById("2FA") as HTMLInputElement;
  try {
    const { data, errors} = await apolloClient.mutate({
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
            twoFA
          }
        }
      `,
      variables: {
        standardLoginInput: {
          username: username.value,
          password: password.value,
          twoFactorCode: twoFA.value,
        },
      },
    });
    if (errors) {
      setError(errors[0].message);
    } else {
      setError("");
    }
    if (data && data.standardLogin) {
      const { id, username, realname, avatar_url, email, campus, twoFA }  = data.standardLogin;
      updateUser({ id, username, realname, avatar_url, email, campus, twoFA });
    }

    return;
  } catch (error) {
    setError("Invalid credentials");
  }
};

const LoginDialog = () => {
  const {updateUser} = React.useContext(UserContext);
  const [error, setError] = useState("");
  const router = useRouter();
  const NEXT_PUBLIC_CLIENT_ID = "u-s4t2ud-fb46f21123114fbf75699a7e6e9ba5db6ba2b51b3ab9b6887ec107e4704cc2ff";
  const NEXT_PUBLIC_OAUTH_URL = "https://api.intra.42.fr/oauth/authorize";
  const NEXT_PUBLIC_REDIRECT = "https://localhost:8443/callback&response_type=code";
  const CLIENT_SECRET = "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";
  // .env not working, using this temporary. do not commit id and secret ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later
  const ft_auth = NEXT_PUBLIC_OAUTH_URL + '?client_id=' + NEXT_PUBLIC_CLIENT_ID + '&redirect_uri=' + NEXT_PUBLIC_REDIRECT;

  function login(): void {
    handleLogin(setError, updateUser);
    router.push('/');
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
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="2FA" className="text-right">
              2FA Code
            </Label>
            <Input
              id="2FA"
              type="2FA"
              placeholder="Only if you've activated 2FA"
              className="col-span-2"
            />
          </div>
          {error && (
            <div style={{ color: 'red' }}>
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button className={styles.button} type="submit" onClick={login}>Login</Button>
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

export { LoginDialog };