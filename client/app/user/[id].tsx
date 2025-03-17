import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

import ProfilePage from "@/components/ui/ProfilePage";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { User } from "@/types/User";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const UserPage = () => {
  const { id: username } = useLocalSearchParams();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios.get(`http://${serverip}:6969/users/${username}`).then((res) => {
      setUser(res.data[0]);
    });
  }, []);

  if (!user) return <Text>Loading...</Text>;

  return (
    <View className="flex-1">
      <ProfilePage user={user} />
    </View>
  );
};

export default UserPage;
