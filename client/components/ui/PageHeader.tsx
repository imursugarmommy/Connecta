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
    <SafeAreaView className="bg-white dark:bg-black border-b border-gray-200 shadow-sm">
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

            <Text className="text-xl dark:text-white font-bold">{authState.name}</Text>
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

        <View className="flex-row gap-x-2 items-center">
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

          <View className="">
            <Image
              className="w-12 h-12 rounded-full"
              source={require("../../assets/images/connecta.png")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PageHeader;
