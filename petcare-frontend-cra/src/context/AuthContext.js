import { createContext, useContext, useState } from "react";

/**
 * Kontekst za avtentikacijo uporabnika
 */
const AuthContext = createContext();

/**
 * AuthProvider
 * Skrbi za prijavo, odjavo in shranjevanje uporabnika ter žetona
 */
export const AuthProvider = ({ children }) => {
  // JWT žeton
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Podatki prijavljenega uporabnika
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  /**
   * Prijava uporabnika
   * Shrani žeton in uporabnika v state in localStorage
   */
  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  /**
   * Odjava uporabnika
   * Počisti state in localStorage
   */
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook za dostop do AuthContext-a
 */
export const useAuth = () => useContext(AuthContext);