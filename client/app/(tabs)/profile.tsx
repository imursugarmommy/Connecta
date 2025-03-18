import React from "react";
import { View } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import ProfilePage from "@/components/ui/ProfilePage";

function Profile() {
  const { authState } = useAuth();

  if (!authState.state) router.push("/auth/login");

  return (
    <View className="flex-1">
      <ProfilePage user={authState} />
    </View>
  );
}

export default Profile;
