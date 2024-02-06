/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useState } from 'react';
import styles from './twoFA/twoFA.module.css';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { Card } from './ui/card';
import { DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

const fetchQR = async () => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation {
          getTwoFaQr
        }
      `,
    });
    return data.getTwoFaQr;
  } catch (error) {
    console.error('Error getting 2FA QR:', error);
  }
};

const TwoFA = () => {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedQR = await fetchQR();
      setQr(fetchedQR);
    };

    fetchInitialData();
    if (qr) {
      console.log('2FA QR code:', qr);
    }
  }, []);

  function activate(): void {
    console.log("Activated");
  }

  return (
    <div className={`${styles.container}`}>
      <Card className={`${styles.twoFACard}`}>
        <div className={styles.contentContainer}>
          <div className={styles.imageContainer}>
            <img src={qr} alt="2FA QR code" />
          </div>
          <div className={styles.textContainer}>
            <div>To enable 2FA just scan this picture with Google authenticator and then press "Activate"</div>
          </div>
          <DialogFooter>
            <Button className={styles.button} type="submit" onClick={activate}>Activate</Button>
          </DialogFooter>
        </div>
      </Card>
    </div>
  );
}

export default TwoFA;