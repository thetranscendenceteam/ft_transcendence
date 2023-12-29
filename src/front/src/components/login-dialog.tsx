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
import { RegisterDialog } from "./register-dialog";

const handleClick = () => {
  // call api vers backend
}

const handleRegister = () => {

}

const LoginDialog = () => {
  const ft_auth = process.env.NEXT_PUBLIC_OAUTH_URL + '?client_id=' + process.env.NEXT_PUBLIC_CLIENT_ID + '&redirect_uri=' + process.env.NEXT_PUBLIC_REDIRECT;

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
          <Button type="submit" onClick={handleClick}>Login</Button>
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
