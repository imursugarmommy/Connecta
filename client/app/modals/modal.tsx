import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { router } from "expo-router";
import axios from "axios";

import Divider from "@/components/ui/Divider";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const moadal = () => {
  const textInputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const onSubmit = () => {
    if (!content || !title) return;
    const username = "placeholder";
    const UserId = 4;

    axios
      .post(`http://${serverip}:6969/posts/`, {
        title,
        content,
        username,
        UserId,
      })
      .then(() => {
        if (router.canGoBack()) {
          router.back();
        }
      });
  };

  return (
    <View className="flex-1 bg-white flex justify-between">
      <View className="flex-row  m-4">
        <Image
          source={require("../../assets/images/favicon.png")}
          style={{
            height: 30,
            width: 30,
            borderRadius: "50%",
            resizeMode: "contain",
          }}
        />
        <View className="flex-grow">
          <TextInput
            ref={textInputRef}
            value={title}
            onChangeText={(title) => setTitle(title)}
            placeholder="What's do you want to talk about?"
            className="p-2 w-full text-sm font-semibold"
          />

          <Divider orientation="horizontal" />

          <TextInput
            value={content}
            onChangeText={(content) => setContent(content)}
            placeholder="What's on your mind?"
            className="w-full p-2  h-60"
            multiline={true}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={"position"}
        keyboardVerticalOffset={125}
        className="absolute bottom-0 w-full">
        <View className="flex-row w-full justify-between items-center py-2 bg-gray-100">
          <View className="flex-row flex-grow py-2 items-center justify-between">
            <Text>Toolbar</Text>
          </View>

          <View>
            <Divider orientation="vertical" />
          </View>

          <TouchableOpacity
            className="items-center p-8 py-2 bg-[#ffd455] rounded-2xl "
            onPress={() => onSubmit()}>
            <Text className="text-white">Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default moadal;
