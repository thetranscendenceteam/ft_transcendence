"use client"

import React, { useContext, useEffect, useState } from 'react';
import { gql } from "@apollo/client";
import apolloClient from "./apolloclient";
import { useSearchParams } from 'next/navigation';
import { UserContext } from "./userProvider";
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import styles from './style/twoFAFt.module.css';

const fetchData = async (code: string | null) => {
  if (code) {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: gql`
          mutation ($code: String!){
            authAsFt(code: $code) {
              id
              username
              realname
              email
              avatar_url
              campus
              jwtToken
              twoFA
            }
          }
        `,
        variables: {
          code: code,
        },
      });
      if(errors) {
        return errors[0].message;
      }
      return data.authAsFt;
    } catch (error) {
      return error;
    }
  }
};

const ftLoginTwoFA = async (username: string | null, twoFA: string | null, updateUser: Function, router: any, setError: Function) => {
  console.log("ftLoginTwoFA: ", username, twoFA);
  if (username && twoFA) {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: gql`
          mutation ($username: String!, $twoFA: String!) {
            ftLoginTwoFA(username: $username, twoFA: $twoFA) {
              id
              username
              realname
              avatar_url
              email
              campus
              jwtToken
              twoFA
            }
          }
        `,
        variables: {
          username: username,
          twoFA: twoFA,
        },
      });
      if (data) {
        const { id, username, realname, avatar_url, email, campus, twoFA }  = data.ftLoginTwoFA;
        updateUser({ id, username, realname, avatar_url, email, campus, twoFA });
        router.push('/');
      }
    } catch (error) {
      setError("Invalid 2FA code");
      return;
    }
  };
};

export const Callback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [data, setData] = useState();
  const [modale, setModale] = useState(Boolean);
  const [username, setUsername] = useState(String);
  const [twoFACode, setTwoFACode] = useState(String);
  const [error, setError] = useState(String);
  const router = useRouter();
  const { updateUser } = useContext(UserContext);
  const [cookies, setCookie] = useCookies(['jwt']);

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData(code);

      if(fetchedData?.graphQLErrors) {
        setModale(true);
        const userSplited = fetchedData?.graphQLErrors[0]?.message.split(" ");
        const username = userSplited[userSplited.length - 1];
        setUsername(username);
        return fetchedData;
      }
      setData(fetchedData);
    };

    fetchInitialData();
    if (data) {
      const { id, username, realname, avatar_url, email, campus, jwtToken, twoFA }  = data;
      updateUser({ id, username, realname, avatar_url, email, campus, twoFA });
      setCookie('jwt', { jwtToken }, { path: '/', secure: true, sameSite: 'strict'});
      router.push('/');
    }
  }, [data, code]);

  useEffect(() => {
    const handleReload = () => {
      window.location.reload();
    };

    window.addEventListener("beforeunload", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, []);

  return (
    <div style={{display:"flex", justifyContent:"center"}}>
      {String(modale) === "true" && (

        <div className={`${styles.container}`}>
          <Card className={`${styles.twoFACard}`}>
            <div className={styles.buttonAndInput}>
              <Input id="2FACode" type="text" placeholder="Enter your 2FA code" onChange={(e) => setTwoFACode(e.target.value)} />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Button className={styles.button} type="submit" onClick={() => {ftLoginTwoFA(username, twoFACode, updateUser, router, setError);}}>
                Login
              </Button>
            </div>
          </Card>
        </div>
      )}
      {String(modale) === "false" && (
      <div>
      {"Logging In..."}
      </div>
      )}
    </div>
  );
};
