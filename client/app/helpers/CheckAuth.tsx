import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { setAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("accessToken");
      const profileImage = await AsyncStorage.getItem("profileImage");

      if (!token) {
        setAuthState({
          id: "",
          state: false,
          username: "",
          email: "",
        });
      } else {
        try {
          const res = await axios.get(
            `http://${process.env.EXPO_PUBLIC_SERVERIP}:6969/users/auth`,
            {
              headers: { accessToken: token },
            }
          );

          if (res.data.error) {
            setAuthState({
              id: "",
              profileImage: "",
              state: false,
              name: "",
              username: "",
              email: "",
            });
          } else {
            setAuthState({
              id: res.data.id,
              profileImage,
              state: true,
              name: res.data.name,
              username: res.data.username,
              email: res.data.email,
            });
          }
        } catch (error) {
          console.error("Error during auth check", error);
        }
      }

      setIsLoading(false);
    }

    checkToken();
  }, [setAuthState]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
