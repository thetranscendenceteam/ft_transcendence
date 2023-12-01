"use client";

import { createContext, useState } from "react";
import type { User } from "./user";

export const UserContext = createContext<User | null>(null);

export function updateUserContext(inuser: User) {
  const [user, setUser] = useState<User | null>(null)  
}

