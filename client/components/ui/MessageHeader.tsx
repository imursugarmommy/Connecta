import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { User } from "@/types/User";
import { ChevronLeft, MoveRight } from "lucide-react-native";
import { router } from "expo-router";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const MessageHeader = ({ user }: { user: User }) => {
  return (
    <SafeAreaView>
      <View className="p-2 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={"#FFD343"}
            size={34}
          />
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={router.push("/user/${user.username}s")} TODO: route to user profile
          className="flex-row items-center justify-between flex-grow gap-x-2">
          <View className="flex-row items-center gap-x-2">
            <Image
              source={{
                uri: `http://${serverip}:6969/images/users/${user.profileImage}`,
              }}
              className="w-9 h-9 rounded-full"
            />
            <Text className="text-lg font-bold">{user.username}</Text>
          </View>
          <View className="p-2">
            <MoveRight
              color={"#d1d5db"}
              size={20}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MessageHeader;
