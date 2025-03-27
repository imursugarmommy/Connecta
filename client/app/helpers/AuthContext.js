import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

const initialAuthState = {
  id: "",
  profileImage: "",
  email: "",
  name: "",
  username: "",
  state: "",
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialAuthState);

  const login = (userData) => {
    setAuthState({
      ...authState,
      ...userData,
    });
  };

  const logout = () => {
    setAuthState(initialAuthState);

    AsyncStorage.removeItem("accessToken");

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
