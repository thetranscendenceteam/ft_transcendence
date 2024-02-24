"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import type { User } from "@/lib/user";
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import apolloClient from "./apolloclient";
import { gql } from "@apollo/client";

interface DecodedToken {
  id: string;
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


export function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const jwtToken = useJwtCookie();

  function updateUser(inUser: User) {
    setUser(inUser);
  }

  const fetchData = async (id: string) => {
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
            id: id
          }
        }
      });
      return (data.getUser);
    } catch (error) {
      removeCookie('jwt');
      return ([]);
    }
  }

  useEffect(() => {
    const fetchDataSetUser = async () => {
      if (jwtToken?.jwtToken && !user) {
        const decodedToken = jwtDecode(jwtToken.jwtToken) as DecodedToken;
        const fetchedData = await fetchData(decodedToken.id);
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
