"use client";

import { ReactNode, createContext, useState } from "react";
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

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}