import React, { useEffect } from "react";
import { View } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import ProfilePage from "@/components/ui/ProfilePage";

function Profile() {
  const { authState } = useAuth();

  useEffect(() => {
    if (!authState.state) {
      router.push("/auth/login");
    }
  }, [authState.state]);

  if (!authState.state) {
    // Optionally, render a loading or placeholder view while redirecting
    return null;
  }

  return (
    <View className="flex-1">
      <ProfilePage user={authState} />
    </View>
  );
}

export default Profile;
