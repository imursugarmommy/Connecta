import React, { useEffect } from "react";
import { View } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import ProfilePage from "@/components/ui/ProfilePage";

function Profile() {
  const { authState } = useAuth();

  if (!authState.state) {
    // Optionally, render a loading or placeholder view while redirecting
    return null;
  }

  return (
    <View className="flex-1 dark:bg-black">
      <ProfilePage user={authState} />
    </View>
  );
}

export default Profile;
