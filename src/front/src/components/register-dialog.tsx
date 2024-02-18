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
import apolloClient from "./apolloclient";
import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export type ButtonVariant = "link" | "ghost" | "transparent" | "black" | "default" | "destructive" | "outline" | "secondary";

type Props = {
  variant: ButtonVariant;
}

const RegisterDialog = ({ variant }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(true);
  const router = useRouter();

  const handleRegister = async (
    username: string,
    password: string,
    password2: string,
    firstname: string,
    lastname: string,
    mail: string
    ) => {

      if (username === "" || password === "" || password2 === "" || firstname === "" || lastname === "" || mail === "") {
        setError("Please fill all fields");
        return;
      }
      if (password !== password2) {
      setError("Passwords do not match");
      return;
      }
      try {
        apolloClient.mutate({
          mutation: gql`
            mutation standardRegister($standardRegisterInput: StandardRegisterInput!) {
              standardRegister(standardRegister: $standardRegisterInput)
            }
          `,
          variables: {
            standardRegisterInput: {
              username: username,
              password: password,
              firstname: firstname,
              lastname: lastname,
              mail: mail,
            },
          },
        });
        setOpened(false);
        router.push('/');
      } catch (e) {
        console.error('Error register standard:', e);
      }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>Register</Button>
      </DialogTrigger>
      { opened &&
        <DialogContent className="sm:max-w-[425px] max-w-72">
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                placeholder="foo_bar"
                className="col-span-2"
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="password2" className="text-right">
                Repeat Password
              </Label>
              <Input
                id="password2"
                type="password"
                placeholder="********"
                className="col-span-2"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="firstname" className="text-right">
                Firstname
              </Label>
              <Input
                id="firstname"
                type="firstname"
                placeholder="Elie"
                className="col-span-2"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="lastname" className="text-right">
                  Lastname
                </Label>
                <Input
                  id="lastname"
                  type="lastname"
                  placeholder="Copter"
                  className="col-span-2"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="mail" className="text-right">
                  E-Mail
                </Label>
                <Input
                  id="mail"
                  type="mail"
                  placeholder="toto@gmail.com"
                  className="col-span-2"
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
          <Button type="submit" onClick={() => handleRegister(username, password, password2, firstname, lastname, mail)}>Register</Button>
          </DialogFooter>
        </DialogContent>
      }
    </Dialog>
  )
}

export { RegisterDialog }
