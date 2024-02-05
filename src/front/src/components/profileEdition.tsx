"use client"

import React, { useState } from 'react';
import { Card } from './ui/card';
import { UserContext } from './userProvider';
import styles from './profile/profile.module.css';
import { DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';

type UserProfileEditionCardProps = {
  user: {
    username: string;
    realname: string;
    email: string;
    avatar_url: string | URL;
    campus: string;
  };
};

const UserProfileEditionCard: React.FC<UserProfileEditionCardProps> = ({ user }) => {
  const [formData, setFormData] = useState({});

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, avatar: file});
    }
  };

  const handleInfoChange = (type: string, value: string) => {
    setFormData({...formData, [type]: value});
  };

  const handleEdit = async () => {
    console.log("🚀 ~ handleInfoChange ~ formData:", formData);
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ($inputUser: EditUserInput!){
            editUser(editUserInput: $inputUser) {
              id
              ftId
              firstName
              lastName
              avatar
              mail
              password
              pseudo
            }
          }
        `,
        variables: {
          inputUser: formData,
        },
      });
      } catch (error) {
        console.error('Error editing user:', error);
      }
    }

  return (
    <Card className={`${styles.card} ${styles.userProfileEditCard}`}>
      <div className="flex justify-center items-center">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
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
              Password
            </Label>
            <Input
              id="password"
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
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => handleInfoChange("email", e.target.value)}
              className="col-span-2"
            />
          </div>
          <DialogFooter>
            <Button className={styles.button} type="submit" onClick={handleEdit}>Edit</Button>
          </DialogFooter>
        </div>
      </div>
    </Card>
  );
};



const ProfileComponent = () => {
  const {user, updateUser} = React.useContext(UserContext);

  React.useEffect(() => {
    let userStorage = window.sessionStorage.getItem("user");
    if (!user && userStorage) {
      updateUser(JSON.parse(userStorage));
    }
  }, []);

  return (
    user && <div className={styles.container}>
      <UserProfileEditionCard user={user} />
    </div>
  );
};

export default ProfileComponent;

