import { createContext, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setTokenProvider } from "../api/httpAuth0";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const getToken = async () => {
    try { return await getAccessTokenSilently(); }
    catch { return null; }
  };

  // Conectamos axios con Auth0 (una sola vez)
  useEffect(() => {
    setTokenProvider(() => getToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        getToken,
        loginWithRedirect,
        logout: () => logout({ returnTo: window.location.origin }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
