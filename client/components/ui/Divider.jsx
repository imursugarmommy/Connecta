import React from "react";
import { Text, View } from "react-native";

export default function Divider({ text = "" }) {
  return (
    <View className="w-full flex-row items-center justify-center my-2 gap-x-4">
      <View className="bg-gray-200 h-px flex-grow rounded-xl"></View>
      {text !== "" && <Text className="text-gray-300">{text}</Text>}
      {text !== "" && (
        <View className="bg-gray-200 h-px flex-grow rounded-xl"></View>
      )}
    </View>
  );
}
