import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Divider from "./Divider";

const LoginReminder = () => {
  return (
    <View className="items-center p-4 dark:bg-[#141414]">
      <View className="w-full items-center mb-4">
        <Text className="text-xl font-bold dark:text-white ">
          Please login to continue
        </Text>

        <Text className="text-sm dark:text-white">
          You need to login to access those features!
        </Text>
      </View>

      <View className="w-full items-center">
        <TouchableOpacity
          onPress={() => router.push("/auth/login" as any)}
          className="bg-[#FFD343] w-5/6 items-center p-3 rounded-md my-2">
          <Text className="text-white dark:text-black">Login</Text>
        </TouchableOpacity>
        <Divider
          orientation="horizontal"
          text="Or"
        />
        <TouchableOpacity
          onPress={() => router.push("/auth/register" as any)}
          className="bg-[#FFD343] w-5/6 items-center p-3 rounded-md my-2">
          <Text className="text-white dark:text-black">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginReminder;
