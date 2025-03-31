import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";

import ProfilePage from "@/components/ui/ProfilePage";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { User } from "@/types/User";
import { ChevronLeft, Search } from "lucide-react-native";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const UserPage = () => {
  const { id: username } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios.get(`http://${serverip}:6969/users/${username}`).then((res) => {
      setUser(res.data[0]);
    });
  }, []);

  if (!user)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-red-500">User Not found!</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 justify-between items-center flex-row dark:bg-black">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={colorScheme === "light" ? "black" : "white"}
            size={28}
          />
        </TouchableOpacity>

        {/* 
        TODO: Implement search functionality.

        <Search
          color={"black"}
          size={24}
        /> 
        */}
      </View>

      <ProfilePage user={user} />
    </SafeAreaView>
  );
};

export default UserPage;
