"use client";

import React from 'react'
import TwoFA from '@/components/twoFA';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/components/apolloclient';

function page() {
  return (
    <ApolloProvider client={apolloClient}>
      <TwoFA/>
    </ApolloProvider>
  )
}

export default page;
