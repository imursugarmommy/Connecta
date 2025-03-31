import { View, Text, TouchableOpacity, Appearance } from "react-native";
import React from "react";
import { Menu } from "lucide-react-native";
import { router } from "expo-router";

const colorScheme = Appearance.getColorScheme();

const Headers = ({ title = "Title", icon = false, ...props }: any) => {
  return (
    <View
      className="flex-row items-center justify-between p-4 px-6 bg-white dark:bg-black border-b border-gray-200 shadow-sm"
      {...props}>
      <Text className="text-3xl text-black dark:text-white">{title}</Text>
      {icon && (
        <TouchableOpacity onPress={() => router.push("/menu")}>
          <Menu
            strokeWidth={1}
            color={colorScheme === "dark" ? "white" : "black"}
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Headers;
