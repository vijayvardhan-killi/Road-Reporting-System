import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authcontext";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";

const buildUserFromToken = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || isTokenExpired(decoded)) return null;
  return { id: decoded.userId, email: decoded.email, role: decoded.role };
};

const AuthProvider = (props) => {
  // sign-in / sign-up form fields (kept for the existing forms)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // real auth state, hydrated from a stored token on first load
  const [accessToken, setAccessTokenState] = useState(() =>
    localStorage.getItem("accessToken")
  );
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? buildUserFromToken(token) : null;
  });

  const loggedIn = !!user;

  // whenever the token changes, keep localStorage + decoded user in sync
  const setAccessToken = useCallback((token) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem("accessToken", token);
      setUser(buildUserFromToken(token));
    } else {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }, []);

  const setLoggedIn = useCallback((value) => {
    if (!value) {
      setAccessToken(null);
    }
  }, [setAccessToken]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setEmail("");
    setPassword("");
    setName("");
  }, [setAccessToken]);

  // if a stored token has expired since last visit, clear it
  useEffect(() => {
    if (accessToken && !buildUserFromToken(accessToken)) {
      setAccessToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        accessToken,
        setAccessToken,
        name,
        setName,
        loggedIn,
        setLoggedIn,
        user,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
