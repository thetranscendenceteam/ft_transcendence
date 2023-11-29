"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
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

const handleClick = () => {
  // call api vers backend
}

const handleRegister = () => {

}

const RegisterDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="black">Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-72">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="foo_bar"
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
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Repeat Password
            </Label>
            <Input
              id="password2"
              type="password"
              placeholder="********"
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleRegister}>Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { RegisterDialog }
