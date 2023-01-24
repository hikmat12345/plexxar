import { createContext, useState } from "react";
import { getCookies } from "../utils";

export const UserContext = createContext();

export const UserDetailProvider = ({ children }) => {
  const [userId, setUserId] = useState(getCookies("userId") ?? null);

  return (
    <UserContext.Provider value={[userId, setUserId]}>
      {children}
    </UserContext.Provider>
  );
};
