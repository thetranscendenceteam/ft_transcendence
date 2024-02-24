"use client"

import React, { useState } from 'react';
import { Card } from './ui/card';
import { UserContext } from './userProvider';
import styles from './style/profile.module.css';
import { DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import apolloClient from './apolloclient';
import axios from 'axios';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

type UserProfileEditionCardProps = {
  userEdit: {
    id: string;
    username: string;
    realname: string;
    email: string;
    avatar_url: string | URL;
    campus: string;
  };
};

const UserProfileEditionCard: React.FC<UserProfileEditionCardProps> = ({ userEdit }) => {
  const [error, setError] = useState("");
  const {user, updateUser} = React.useContext(UserContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: null,
    password: null,
    password2: null,
    username: null,
    file: null,
  }) as [{ email: string | null, password: string | null, password2: string | null, username: string | null, file: File | null }, Function];

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, file: file});
    }
  };

  const handleInfoChange = (type: string, value: string) => {
    setFormData({...formData, [type]: value});
  };

  const handleEdit = async () => {
    setError("");
    if (formData.password && formData.password2 && formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password && !formData.password2) {
      setError('Missing password validation');
      return; 
    }
    if (!formData.password && formData.password2) {
      setError('Missing password');
      return; 
    }

    if (formData.username && ! (formData.username.length >= 4 && formData.username.length <= 10 && formData.username.match(/^[a-zA-Z0-9]+$/))) {
      setError("Username must be between 4 and 10 alpha-numerical characters.");
      return;
    }
    if (formData.password && (formData.password?.length < 6 || formData.password?.length > 20 || !formData.password?.match(/^[a-zA-Z0-9@#$]+$/))) {
      setError("Password must be beween 6 and 20characters, alpha-numerical or @, # and $.");
      return;
    }
    if (formData.email && (!formData.email?.match(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-z]+$/))) {
      setError("Invalid email format.");
      return;
    }

    const formDataReady = formData.hasOwnProperty('password2') ? { ...formData, password2: undefined } : { ...formData };
    try {
      if (formDataReady.file) {
        const formdata = new FormData();
        const file  = formDataReady.file as File;
        formdata.append('avatar', file, file.name);
        await axios.post('https://' + process.env.NEXT_PUBLIC_DOMAIN_NAME + ':8443/avatar', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        }).catch((error: any) => {
          console.error('Error uploading the file:', error);
        });
      }
      try {
        const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ($inputUser: EditUserInput!){
            editUser(editUserInput: $inputUser) {
              id 
              pseudo
              mail
              avatar
            }
          }
        `,
        variables: {
          inputUser: { id: userEdit.id, mail: formDataReady.email, password: formDataReady.password, pseudo: formDataReady.username },
        },
      });
      updateUser({...user, email: data.editUser.mail, username: data.editUser.pseudo, avatar_url: data.editUser.avatar});
      router.push('/profile');
    } catch (error: any) {
      if (error.message && error.message.includes("Unique constraint failed on the fields: (`pseudo`)")) {
        setError("Username already taken");
        return;
      }
      if (error.message && error.message.includes("Unique constraint failed on the fields: (`mail`)")) {
        setError("Email already taken");
        return;
      }
    }
    } catch (error) {
      console.error('Error editing user:', error);
    }
  }

  return (
    <Card className={`${styles.card} ${styles.userProfileEditCard}`}>
      <div className="flex justify-center items-center">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Avatar
            </Label>
            <input
              id="image"
              type="file"
              name="avatar"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              type="username"
              placeholder="Username"
              onChange={(e) => handleInfoChange("username", e.target.value)}
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
              onChange={(e) => handleInfoChange("password", e.target.value)}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="password2" className="text-right">
              Password validation
            </Label>
            <Input
              id="password2"
              type="password"
              placeholder="********"
              onChange={(e) => handleInfoChange("password2", e.target.value)}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="mail"
              placeholder="example@gmail.com"
              onChange={(e) => handleInfoChange("email", e.target.value)}
              className="col-span-2"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button className={styles.button} type="submit" onClick={handleEdit}>Edit</Button>
          </DialogFooter>
        </div>
      </div>
    </Card>
  );
};



const ProfileComponent = () => {
  const { user } = React.useContext(UserContext);

  return (
    user && <div className={styles.container}>
      <UserProfileEditionCard userEdit={user} />
    </div>
  );
};

export default ProfileComponent;

