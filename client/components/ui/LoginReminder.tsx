import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Divider from "./Divider";

const LoginReminder = () => {
  return (
    <View className="items-center p-4">
      <View className="w-full items-center mb-4">
        <Text className="text-xl font-bold">Please login to continue</Text>

        <Text className="text-sm">
          You need to login to access those features!
        </Text>
      </View>

      <View className="w-full items-center">
        <TouchableOpacity
          onPress={() => router.push("/auth/login" as any)}
          className="bg-[#FFD343] w-5/6 items-center p-3 rounded-md my-2">
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
        <Divider
          orientation="horizontal"
          text="Or"
        />
        <TouchableOpacity
          onPress={() => router.push("/auth/login" as any)}
          className="bg-[#FFD343] w-5/6 items-center p-3 rounded-md my-2">
          <Text className="text-white">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginReminder;
