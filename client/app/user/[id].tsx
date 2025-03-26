import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserPage = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center bg-white p-4">
      <Text>{id}</Text>
    </View>
  );
};

export default UserPage;
