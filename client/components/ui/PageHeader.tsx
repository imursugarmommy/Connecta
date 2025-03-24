import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";

import { useAuth } from "@/app/helpers/AuthContext";
import { Bell, CircleUserRound } from "lucide-react-native";
import { router } from "expo-router";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const PageHeader = () => {
  const { authState } = useAuth();

  return (
    <SafeAreaView className="bg-white border-b border-gray-200 shadow-sm">
      <View className="p-4 flex-row items-center justify-between relative">
        {authState.state ? (
          <View className="flex-row items-center gap-x-2">
            {authState.profileImage ? (
              <Image
                source={{
                  uri: `http://${serverip}:6969/images/users/${authState.profileImage}`,
                }}
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <View
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `hsl(${authState.id}, 40%, 40%)`,
                }}>
                <Text className="text-white text-xl">
                  {authState.name?.split("")[0].toUpperCase() || ""}
                </Text>
              </View>
            )}

            <Text className="text-xl font-bold">{authState.name}</Text>
          </View>
        ) : (
          <View className="flex-row gap-x-2 items-center">
            <CircleUserRound
              color={"#9ca3af"}
              size={40}
              strokeWidth={1}
            />

            <Text className="text-[#9ca3af] text-lg">Welcome!</Text>
          </View>
        )}

        <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3 bg-white">
          {/* TODO: change to app icon */}
          <Image className="w-12 h-12" />
        </View>

        {/* TODO: add functionality */}
        {/* {authState.state && (
          <View>
            <Bell
              color={"#FFD343"}
              fill={"#FFD343"}
              size={24}
            />
          </View>
        )} */}
        {!authState.state && (
          <TouchableOpacity
            className="p-2 px-4 rounded-full border border-gray-200"
            onPress={() => router.push("/auth/login")}>
            <Text>Sign in</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PageHeader;
