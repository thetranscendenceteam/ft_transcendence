"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import type { User } from "@/lib/user";
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import apolloClient from "./apolloclient";
import { gql } from "@apollo/client"

interface DecodedToken {
  ftId: number;
  username: string;
  iat: number;
  exp: number;
}

export const UserContext = createContext<{ user: User | null; updateUser: any }>({
  user: null,
  updateUser: null,
});

function useJwtCookie() {
  const [cookies] = useCookies(['jwt']);
  const jwtCookie = cookies['jwt'];

  return (jwtCookie ? jwtCookie : null);
}

const fetchData = async (ftId: number) => {
  console.log("fetchData");
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query GetUser($UserInput: GetUserInput!) {
          getUser(UserInput: $UserInput) {
            id 
            pseudo
            mail
            firstName
            lastName
            avatar
            campus
            twoFA
          }
        }
      `,
      variables: {
        UserInput: {
          ftId: ftId
        }
      }
    });
    console.log("data", data);
    return (data.getUser);
  } catch (error) {
    return ([]);
  }
}

export function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const jwtToken = useJwtCookie();

  function updateUser(inUser: User) {
    setUser(inUser);
  }

  useEffect(() => {
    const fetchDataSetUser = async () => {
      if (jwtToken?.jwtToken && !user) {
        const decodedToken = jwtDecode(jwtToken.jwtToken) as DecodedToken;
        const fetchedData = await fetchData(decodedToken.ftId);
        if (fetchedData) {
          const user: User = {
            id: fetchedData.id,
            username: fetchedData.pseudo,
            realname: `${fetchedData.firstName} ${fetchedData.lastName}`,
            avatar_url: fetchedData.avatar,
            email: fetchedData.mail,
            campus: fetchedData.campus,
            twoFA: fetchedData.twoFA
          };
          updateUser(user);
        }
      }
    };

    fetchDataSetUser();
  }, [jwtToken]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
