import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SendHorizonal } from "lucide-react-native";

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey! How's it going?", sender: "other" },
    { id: "2", text: "All good! You?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: input, sender: "me" },
      ]);
      setInput("");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "relative",
      }}>
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
        keyboardVerticalOffset={85}
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
