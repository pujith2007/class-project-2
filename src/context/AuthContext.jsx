import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listenToAuthChanges } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    // Firebase returns an unsubscribe function; cleanup prevents duplicate listeners in development.
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      authLoading,
      isAuthenticated: Boolean(currentUser)
    }),
    [currentUser, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
