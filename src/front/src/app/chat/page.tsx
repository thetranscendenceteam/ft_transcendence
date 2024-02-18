"use client";
import React from 'react'
import {Chat} from '@/components/chat' 
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/components/apolloclient';

function page() {
  return (
    <ApolloProvider client={apolloClient}>
      <Chat/>
    </ApolloProvider>
  )
}

export default page;
