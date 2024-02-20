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
import styles from './style/profile.module.css';
import { useState } from "react";
import { UserContext } from "./userProvider";
import React from "react";
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { ButtonVariant } from './register-dialog';

type Props = {
  variant: ButtonVariant;
  className?: string;
}

const LoginDialog = ({ variant, className }: Props) => {
  const {updateUser} = React.useContext(UserContext);
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(['jwt']);
  const router = useRouter();
  const NEXT_PUBLIC_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
  const NEXT_PUBLIC_OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL;
  const NEXT_PUBLIC_OAUTH_REDIRECT = process.env.NEXT_PUBLIC_OAUTH_REDIRECT;
  if (!NEXT_PUBLIC_OAUTH_CLIENT_ID || !NEXT_PUBLIC_OAUTH_URL || !NEXT_PUBLIC_OAUTH_REDIRECT) {
    throw new Error("Missing environment variables for OAuth");
  }
  // .env not working, using this temporary. do not commit id and secret ! replace by process.env.NEXT_PUBLIC_CLIENT_ID later
  const ft_auth = NEXT_PUBLIC_OAUTH_URL + '?client_id=' + NEXT_PUBLIC_OAUTH_CLIENT_ID + '&redirect_uri=' + NEXT_PUBLIC_OAUTH_REDIRECT + '&response_type=code';

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
        const { id, username, realname, avatar_url, email, campus, jwtToken, twoFA }  = data.standardLogin;
        updateUser({ id, username, realname, avatar_url, email, campus, twoFA });
        setCookie('jwt', { jwtToken }, { path: '/', secure: true, sameSite: 'strict'});
      }

      return;
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  function login(): void {
    handleLogin(setError, updateUser);
    router.push('/');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>Login</Button>
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
          <Button type="submit" onClick={login}>Login</Button>
        </DialogFooter>
        <div>
          <p className="text-center" style={{fontSize: "10px", color: "darkgrey"}}><a href="/resetPassword">Forgot your password? Reset it here</a></p>
        </div>
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
