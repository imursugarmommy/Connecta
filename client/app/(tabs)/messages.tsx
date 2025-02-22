import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const ChatList = () => {
  const chats = [
    { id: "1", name: "John Doe", lastMessage: "Hey, what's up?" },
    { id: "2", name: "Jane Smith", lastMessage: "Let's catch up soon!" },
  ];

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-2 py-5 border-b border-[#FFD343]"
            onPress={() => router.push(`/chat/${item.id}`)}>
            <Text className="text-[#FFD343] text-lg font-bold">
              {item.name}
            </Text>
            <Text className="text-gray-500">{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatList;
