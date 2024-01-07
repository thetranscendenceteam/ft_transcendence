
import React from 'react'
import { gql } from "@apollo/client";
import apolloClient from "./apolloclient";
import { useSearchParams } from 'next/navigation'

export const Callback = async () => {
  // Test connexion front-back
  /*const { data, loading, error } = await apolloClient.query({
    fetchPolicy: "no-cache",
    query: gql`
      {
        user {
          id
          nickname
          avatar
        }
      }
    `,
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
        <h1> Connecting... </h1>
      </div>
    )
  }
  if (error) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
        <h1>There was an error with the backend authentification.</h1>
        <h1>Please retry.</h1>
      </div>
    )
  }*/

  //const searchParams = useSearchParams();
  //const code = searchParams.get('code');

  /*const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation ($code: String!){
        getFtAuth(code: $code)
      }
    `,
    variables: {
      code: 'aee9342122585e39e4261cea325c4fc3113671b37ba9c39d4497f9cb02f8aa98',
    },
  });*/
console.log('Front: ', JSON.stringify('data'));
    return (
      JSON.stringify('data')
    )
}
