/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useState } from 'react';
import styles from './style/twoFA.module.css';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserContext } from './userProvider';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';

const fetchQR = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation getTwoFaQr($id: String!){
          getTwoFaQr(id: $id)
        },
      `,
      variables: {
        id: id
      }
    });
    return data.getTwoFaQr;
  } catch (error) {
    console.error('Error getting 2FA QR:', error);
  }
};

const toggleTwoFA = async (id: string, code: string, value: boolean, setError: Function) => {
  try {
    const { data, errors } = await apolloClient.mutate({
      mutation: gql`
        mutation toggleTwoFA($id: String!, $code: String!, $toggleTwoFA: Boolean!){
          toggleTwoFA(id: $id, code: $code, toggleTwoFA: $toggleTwoFA)
        },
      `,
      variables: {
        id: id,
        code: code,
        toggleTwoFA: value,
      }
    });
    if (errors) {
      setError(errors[0].message);
    } else {
      setError("");
    }
    return data.getTwoFaQr;
  } catch (error) {
    setError("Error when toggling 2FA");
  }
};

const TwoFA = () => {
  const [qr, setQr] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [error, setError] = useState("");
  const {user, updateUser} = React.useContext(UserContext);
  const router = useRouter();
  
  useEffect(() => {
    const fetchInitialData = async () => {
      if (user) {
        const fetchedQR = await fetchQR(user.id);
        setQr(fetchedQR);
      }
    };

    fetchInitialData();
  }, []);

  function activate(): void {
    if (user && twoFACode) {
      toggleTwoFA(user.id, twoFACode, true, setError);
      updateUser({...user, twoFA: true});
      router.push('/');
    }
  }

  function deactivate(): void {
    if (user && twoFACode) {
      toggleTwoFA(user.id, twoFACode, false, setError);
      updateUser({...user, twoFA: false});
      router.push('/');
    }
  }
  return (
<div className={`${styles.container}`}>
  <Card className={`${styles.twoFACard}`}>
    <div className={styles.contentContainer}>
      <div className={styles.imageContainer}>
        <img src={qr} alt="2FA QR code" />
      </div>
      {error && (
        <div style={{ color: 'red' }}>
          Invalid 2FA code
        </div>
      )}
      {
        String(user?.twoFA) === "true" &&
        <div>
          <div>
            To disable 2FA just enter a 2FA code and then press "Deactivate".
          </div>
          <div style={{alignContent:"center"}}>
            <Input id="2FADeactivate" type="text" placeholder="Enter a 2FA code" onChange={(e) => setTwoFACode(e.target.value)} />
            <Button className={styles.button} type="submit" onClick={deactivate}>Deactivate</Button>
          </div>
        </div>
      }
      {
        String(user?.twoFA) === "false" &&
        <div>
          <div>
            To enable 2FA just scan this picture with Google authenticator, enter a 2FA code and then press "Activate".
          </div>
          <div style={{alignContent:"center"}}>
            <Input id="2FAActivate" type="text" placeholder="Enter a 2FA code" onChange={(e) => setTwoFACode(e.target.value)} />
            <Button className={styles.button} type="submit" onClick={activate}>Activate</Button>
          </div>
        </div>
      }
    </div>
  </Card>
</div>
  );
}

export default TwoFA;
