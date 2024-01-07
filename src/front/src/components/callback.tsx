"use client"

import React, { useEffect, useState } from 'react';
import { gql } from "@apollo/client";
import apolloClient from "./apolloclient";
import { useSearchParams } from 'next/navigation';

export const Callback = async () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  //console.log("Initial code: ", code);
    
  const fetchData = async (code: string | null) => {
    if (code) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: gql`
            mutation ($code: String!){
              getFtAuth(code: $code)
            }
          `,
          variables: {
            code: code,
          },
        });

        console.log('Front: ', JSON.stringify(data.getFtAuth));
        return data.getFtAuth;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  //console.log('Render with code:', code);
  const token = await fetchData(code);
  console.log(token);

  return (
    <div>
      {JSON.stringify(token)}
    </div>
  );
};