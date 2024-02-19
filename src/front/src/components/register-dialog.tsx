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
import { useEffect, useState } from "react";
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
      if(firstname.length < 1 || firstname.length > 15 || !firstname.match(/^[a-zA-Z-]+$/)){
        setError("Firstname must be between 1 and 15 characters and alphabetical only.");
        return;
      }
      if(lastname.length < 1 || lastname.length > 15 || !lastname.match(/^[a-zA-Z-]+$/)){
        setError("Firstname must be between 1 and 15 characters and alphabetical only.");
        return;
      }
      if (username.length < 4 || username.length > 10 || !username.match(/^[a-zA-Z0-9]+$/)){
        setError("Username must be between 4 and 10 alpha-numerical characters.");
        return;
      }
      if (password.length < 6 || password.length > 20 || !password.match(/^[a-zA-Z0-9@#$]+$/)){
        setError("Password must be beween 6 and 20characters, alpha-numerical or @, # and $.");
        return;
      }
      if (!mail.includes('@') || !mail.includes('.') || !mail.match(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-z]+$/)) {
        setError("Invalid email format.");
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
        setError("Some fields are already taken");
      }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} onClick={() => setOpened(true)}>Register</Button>
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
