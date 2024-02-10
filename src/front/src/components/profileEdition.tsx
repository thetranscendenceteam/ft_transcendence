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
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: null,
    password:null,
    password2:null,
    username: null,
  });

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      console.log("🚀 ~ handleImageChange ~ file:", file)
      const formData = new FormData();
      formData.append('avatar', file, file.name);
  
      try {
        const response = await fetch('http://localhost:8443/upload/image', {
          method: 'POST',
          body: formData,
          //mode: 'no-cors', didnt fix the issue
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Upload successful. File details:', data);
        } else {
          console.error('Upload failed. HTTP status:', response.status);
        }
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    }
  };

  const handleInfoChange = (type: string, value: string) => {
    setFormData({...formData, [type]: value});
  };

  const handleEdit = async () => {
    console.log("🚀 ~ handleInfoChange ~ formData:", formData);
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

    const formDataReady = formData.hasOwnProperty('password2') ? { ...formData, password2: undefined } : { ...formData };
    console.log(formData);
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ($inputUser: EditUserInput!){
            editUser(editUserInput: $inputUser) {
              id
              ftId
              firstName
              lastName
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
            <Label htmlFor="image" className="text-right">
              Avatar
            </Label>
            <input
              id="image"
              type="file"
              name="avatar"
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
              id="mail"
              type="mail"
              placeholder="example@gmail.com"
              onChange={(e) => handleInfoChange("mail", e.target.value)}
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

