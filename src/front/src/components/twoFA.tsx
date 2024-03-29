/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useState } from 'react';
import styles from './style/twoFA.module.css';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserContext } from './userProvider';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';

const TOGGLE_TWO_FA = gql`
  mutation toggleTwoFA($id: String!, $code: String!, $toggleTwoFA: Boolean!){
    toggleTwoFA(id: $id, code: $code, toggleTwoFA: $toggleTwoFA)
  },
`;

const GET_TWO_FA_QR = gql`
  mutation getTwoFaQr($id: String!){
    getTwoFaQr(id: $id)
  },
`;

const TwoFA = () => {
  const [qr, setQr] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [error, setError] = useState("");
  const {user, updateUser} = React.useContext(UserContext);
  const router = useRouter();

  const [toggleTwoFA, { data: toggleRes, error: toggleError, loading: toggleLoading }] = useMutation(TOGGLE_TWO_FA);
  const [fetchQR, { data: dataQR, error: fetchError }] = useMutation(GET_TWO_FA_QR, {
    variables: { id: user ? user.id : "" }
  });

  useEffect(() => {
    if (user && user.id) {
      fetchQR();
    }
  }, [user, fetchQR]);
  
  useEffect(() => {
    if (fetchError) {
      return;
    }
    if (dataQR) {
      setQr(dataQR.getTwoFaQr);
    }
  }, [dataQR, fetchError]);

  useEffect(() => {
    if (toggleError && !toggleLoading) {
      setError(toggleError.message);
      return;
    }
    if (toggleRes && !toggleLoading && user) {
      setError("");
      updateUser({...user, twoFA: user.twoFA ? false : true });
      router.push('/');
    }
  }, [toggleError, toggleRes, toggleLoading]);

  function activate(): void {
    if (user && twoFACode) {
      try {
        toggleTwoFA({
          variables: {
            id: user.id,
            code: twoFACode,
            toggleTwoFA: true
          }
        }).then(({ data }) => {
				}).catch(e => {
					setError("Error when toggling 2FA");
				});
      } catch (e) {
        setError("Error when toggling 2FA");
      }
    }
  }

  function deactivate(): void {
    if (user && twoFACode) {
      try {
        const res = toggleTwoFA({
          variables: {
            id: user.id,
            code: twoFACode,
            toggleTwoFA: false
          }
        }).then(({ data }) => {
				}).catch(e => {
				setError("Error when toggling 2FA");
				});
      } catch (e) {
        setError("Error when toggling 2FA");
      }
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
