import { View, Text, SafeAreaView, TouchableOpacity, Appearance } from "react-native";
import React from "react";
import { router } from "expo-router";
import { ChevronLeft, LogOut } from "lucide-react-native";
import { useAuth } from "./helpers/AuthContext";

const colorScheme = Appearance.getColorScheme();

const menu = () => {
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 p-4 pb-4 justify-between items-center flex-row border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={colorScheme === "dark" ? "white" : "black"}
            size={28}
          />
        </TouchableOpacity>

        <View className="flex-grow justify-center items-center">
          <Text className="dark:text-white">Settings and Activity</Text>
        </View>

        {/* placeholder for the right placement of header */}
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={"transparent"}
            size={28}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center p-4">
        <TouchableOpacity
          onPress={logout}
          className="w-full flex-row gap-x-2 items-center justify-center">
          <LogOut color={"#f87171"} />

          <Text className="text-lg text-[#f87171]">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default menu;
