import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/me", {
          withCredentials: true,
        });

        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log("LOGIN RESPONSE:", response.data);

      setUser(response.data.user);

      console.log("USER SET:", response.data.user);

      return response.data;
    } catch (error) {
      console.log("LOGIN API ERROR:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
