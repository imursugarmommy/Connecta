import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../helpers/AuthContext";
import { User } from "@/types/User";

interface Chat {
  id: number;
  userId: number;
  userId2: number;
  createdAt: string;
  updatedAt: string;
}

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const ChatList = () => {
  const { authState } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [friends, setFriends] = useState<{ [key: number]: User }>({});

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    fetchData().finally(() => {
      setRefreshing(false);
    });
  }, [serverip, setChats]);

  function getFriendId(chat: Chat) {
    if (authState.id === Number(chat.userId)) return Number(chat.userId2);
    else if (authState.id === Number(chat.userId2)) return Number(chat.userId);
    return 0;
  }

  async function fetchData() {
    const accessToken = await AsyncStorage.getItem("accessToken");

    await axios.get(`http://${serverip}:6969/follows/mutual/${authState.id}`, {
      headers: {
        accessToken,
      },
    });

    const chatResponse = await axios.get(`http://${serverip}:6969/chats/`, {
      headers: {
        accessToken,
      },
    });

    setChats(chatResponse.data);

    const friendIds = chatResponse.data.map((chat: Chat) => getFriendId(chat));

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

  useEffect(() => {
    fetchData();
  }, [authState.id]);

  const renderItems = ({ item }: { item: Chat }) => {
    const friendId = getFriendId(item);
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
                {friend?.name?.split("")[0].toUpperCase() || ""}
              </Text>
            </View>
          )}
          <Text className="text-[#FFD343] text-lg font-bold">
            {friend?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black dark:text-white">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItems}
      />
    </View>
  );
};

export default ChatList;
