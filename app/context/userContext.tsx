//@ts-nocheck
import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

type SessionUser = {
  username: string;
  email: string;
  team: "Cats" | "Dogs";
  photoUri?: string | null;
  admin?: boolean;
};

const UserContext = createContext({
  signIn: async (user: any) => {},  // store full user object
  signOut: () => {},
  session: null, // will hold the user object
  isLoading: false,
});

export function useSession() {
  const value = useContext(UserContext);
  if (!value) throw new Error("useSession must be wrapped in a <SessionProvider />");
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <UserContext.Provider
      value={{
        signIn: async (user: any) => {
          // store the full user object as session because we will need user info to display and persist
          setSession(JSON.stringify(user)); // convert object to string for storage
        },
        signOut: async () => {
          setSession(null);
        },
        // parsing user object because when sending into local storage (web) or secure store (mobile),
        // it only stores Strings
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
