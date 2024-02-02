"use client"

import React, { useEffect, useState } from 'react';
import { gql } from "@apollo/client";
import apolloClient from "./apolloclient";
import { useSearchParams } from 'next/navigation';
import { UserProvider } from './userProvider';
import { useRouter } from 'next/router';

const fetchData = async (code: string | null) => {
  if (code) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ($code: String!){
            authAsFt(code: $code) {
              id
              username
              realname
              avatar_url
              jwtToken
            }
          }
        `,
        variables: {
          code: code,
        },
      });

      console.log('Front: ', JSON.stringify(data));
      return data; // Return the entire response data
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

export const Callback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await fetchData(code);
      setData(fetchedData);
    };

    fetchInitialData();
    if (data) {
      UserProvider(data);
      router.push('/');
    }
  }, []);

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
    <div>
      <div>{"Logging In..."}</div>
    </div>
  );
};