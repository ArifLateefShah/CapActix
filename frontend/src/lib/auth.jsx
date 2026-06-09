import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setToken, getToken, formatApiError } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | guest

  const bootstrap = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setStatus("guest");
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      setStatus("authenticated");
    } catch (_err) {
      setToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    bootstrap();
  }, [bootstrap]);

  const register = async (email) => {
    try {
      const { data } = await api.post("/auth/register", { email });
      setToken(data.token);
      setUser(data.user);
      setStatus("authenticated");
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, error: formatApiError(err) };
    }
  };

  const login = async (email) => {
    try {
      const { data } = await api.post("/auth/login", { email });
      setToken(data.token);
      setUser(data.user);
      setStatus("authenticated");
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, error: formatApiError(err) };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStatus("guest");
  };

  return (
    <AuthContext.Provider value={{ user, status, register, login, logout, refresh: bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
