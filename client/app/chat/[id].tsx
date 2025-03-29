import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SendHorizonal } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "../helpers/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageHeader from "../../components/ui/MessageHeader";
import { User } from "@/types/User";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

interface Message {
  id: number;
  text: string;
  chatId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const Messages = () => {
  const { authState } = useAuth();
  const { id: chatId } = useLocalSearchParams();

  const [chatUser, setChatUser] = useState<User>();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hey! How's it going?", sender: "other" },
    { id: "2", text: "All good! You?", sender: "me" },
  ]);

  useLayoutEffect(() => {
    async function checkChatAuth() {
      const response = await axios.get(
        `http://${serverip}:6969/chats/${chatId}`
      );

      const chat = response.data;

      if (
        authState.id !== Number(chat.userId) &&
        authState.id !== Number(chat.userId2)
      ) {
        alert("You are not authorized to view this chat!");
        router.push("/");
        return;
      }

      const chatUserId =
        authState.id !== Number(chat.userId) ? chat.userId : chat.userId2;

      const chatUserResponse = await axios.get(
        `http://${serverip}:6969/users/byid/${chatUserId}`
      );

      setChatUser(chatUserResponse.data);
    }

    checkChatAuth();
  }, []);

  useEffect(() => {
    async function getMessages() {
      const messageResponse = await axios.get(
        `http://${serverip}:6969/messages/${chatId}`
      );

      const messagesData = messageResponse.data.map((message: Message) => ({
        ...message,
        sender: message.userId === authState.id ? "me" : "other",
      }));

      setMessages(messagesData);
    }

    getMessages();
  }, []);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      chatId: Number(chatId),
    };

    const response = await axios.post(
      `http://${serverip}:6969/messages`,
      newMessage,
      {
        headers: {
          accessToken: await AsyncStorage.getItem("accessToken"),
        },
      }
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...response.data, sender: "me" },
    ]);
    setInput("");
  };

  if (!chatUser || !messages)
    return (
      <View className="flex-1 justify-between items-center">
        <ActivityIndicator
          size="small"
          color="#0000ff"
        />
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "relative",
      }}>
      <MessageHeader user={chatUser} />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View
            className="p-2 rounded-2xl my-1"
            style={{
              alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
              backgroundColor: item.sender === "me" ? "#FFD343" : "#ccc",
              maxWidth: "70%",
            }}>
            <Text className="text-white">{item.text}</Text>
          </View>
        )}
      />
      <KeyboardAvoidingView
        behavior={"position"}
        className="absolute bottom-0 w-full">
        <View className="flex-row w-full justify-between items-center p-2 px-3 pb-5 bg-[#D0D3D9]">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#000"
            className="flex-1 bg-white text-black p-2.5 rounded-xl"
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-2.5 p-2.5 rounded-full bg-[#FFD343]">
            <SendHorizonal
              color={"#fff"}
              size={18}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Messages;
