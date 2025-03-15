import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../helpers/AuthContext";

interface Chat {
  id: number;
  userId: number;
  userId2: number;
  createdAt: string;
  updatedAt: string;
}

interface Friend {
  id: number;
  username: string;
  profileImage: string;
}

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const ChatList = () => {
  const { authState } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [friends, setFriends] = useState<{ [key: number]: Friend }>({});

  useEffect(() => {
    async function fetchData() {
      const accessToken = await AsyncStorage.getItem("accessToken");

      const chatResponse = await axios.get(`http://${serverip}:6969/chats/`, {
        headers: {
          accessToken,
        },
      });

      setChats(chatResponse.data);

      const friendIds = chatResponse.data.map((chat: Chat) =>
        chat.userId === authState.id ? chat.userId2 : chat.userId
      );

      const friendResponses = await Promise.all(
        friendIds.map((id: number) =>
          axios.get(`http://${serverip}:6969/users/byid/${id}`)
        )
      );

      const friendsData = friendResponses.reduce((acc, res) => {
        acc[res.data.id] = res.data;
        return acc;
      }, {});

      setFriends(friendsData);
    }

    fetchData();
  }, [authState.id]);

  const renderItems = ({ item }: { item: Chat }) => {
    const friendId = item.userId === authState.id ? item.userId2 : item.userId;
    const friend = friends[friendId];

    return (
      <TouchableOpacity
        className="p-2 py-5 border-b border-[#FFD343]"
        onPress={() => router.push(`/chat/${item.id}` as any)}>
        <View className="flex-row items-center gap-x-2">
          {friend && friend.profileImage ? (
            <Image
              source={{
                uri: `http://${serverip}:6969/images/users/${friend.profileImage}`,
              }}
              className="w-8 h-8 rounded-full object-cover bg-gray-200"
            />
          ) : (
            <View
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `hsl(${friend ? friend.id : 0}, 40%, 40%)`,
              }}>
              <Text className="text-white text-xl">
                {friend?.username?.split("")[0].toUpperCase() || ""}
              </Text>
            </View>
          )}
          <Text className="text-[#FFD343] text-lg font-bold">
            {/* TODO: change to name when merged */}
            {friend?.username}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItems}
      />
    </View>
  );
};

export default ChatList;
