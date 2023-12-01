"use client";

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
import Image from "next/image";

const handleLogin = () => {
  // call api vers backend
  const username: HTMLInputElement = document.getElementById("username") as HTMLInputElement;
  const password: HTMLInputElement = document.getElementById("password") as HTMLInputElement;
  console.log(`username: ${username.value}\npassword: ${password.value}\n`);
    
}

const LoginDialog = () => {
  let redirect_url: string = process.env.NEXT_PUBLIC_OAUTH_URL +
    "?client_id=" + process.env.NEXT_PUBLIC_CLIENT_ID +
    "&scope=" + process.env.NEXT_PUBLIC_SCOPE;
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
          <Button type="submit" onClick={handleLogin}>Login</Button>
        </DialogFooter>
        <div className="flex items-center">
          <hr className="flex-1"/>
          <p className="m-2">or</p> 
          <hr className="flex-1"/>
        </div>
        <a href={redirect_url} className="flex">
          <Button className="flex-1 flex align-middle">
            Login with
            <Image src="/42_Logo.svg" height={30} width={30} alt="42 logo" className="ml-2"/>
          </Button>
        </a>
      </DialogContent>
    </Dialog>
  )
}

export { LoginDialog }
