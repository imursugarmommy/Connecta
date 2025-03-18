import React from "react";
import { View } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import ProfilePage from "@/components/ui/ProfilePage";

function Profile() {
  const { authState } = useAuth();

  const user = {
    id: 2,
    username: "test",
    email: "levi@leckeier",
    profileImage: "random-user.png",
    name: "tester",
    password: "password",
    createdAt: "2021-08-02T20:00:00.000Z",
    updatedAt: "2021-08-02T20:00:00.000Z",
  };

  if (!authState.state) router.push("/auth/login");

  return (
    <View className="flex-1">
      <ProfilePage user={authState} />
    </View>
  );
}

export default Profile;
