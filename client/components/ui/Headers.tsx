import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Menu } from "lucide-react-native";

const Headers = ({
  title = "Title",
  handleSubmit = () => {},
  icon = false,
  ...props
}: any) => {
  return (
    <View
      className="flex-row items-center justify-between p-4 px-6 bg-white dark:bg-[#242732]"
      {...props}>
      <Text className="text-3xl text-black dark:text-white">{title}</Text>
      {icon && (
        <TouchableOpacity onPress={handleSubmit}>
          <Menu
            strokeWidth={1}
            color={"black"}
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Headers;
