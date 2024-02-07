"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import type { User } from "@/lib/user";

export const UserContext = createContext<{ user: User | null; updateUser: any }>({
  user: null,
  updateUser: null,
});

export function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  function updateUser(inUser: User) {
    setUser(inUser);
  }

  function getCookie(name: string) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    console.log(cookieValue);
    return cookieValue ? cookieValue.pop() : null;
  }

  //function decodeToken(token) {
  //  try {
  //    const decodedToken = decode(token);

  //    if (!decodedToken || !decodedToken.user) {
  //      return (null);
  //    }
  //    return (decodedToken.user);
  //  } catch (error) {
  //    console.error('Error decoding token:', error);
  //    return (null);
  //  }
  //}

  useEffect(() => {
    const jwtToken = getCookie('jwt');

    if (jwtToken) {
  //    const user = decodeToken(jwtToken);
  //    setUser(user);
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
