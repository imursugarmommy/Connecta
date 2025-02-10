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

const moadal = () => {
  const textInputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const onSubmit = () => {
    if (!content || !title) return;

    axios
      .post(`http://${serverip}:6969/posts/`, {
        title,
        content,
      })
      .then(() => {
        if (router.canGoBack()) {
          router.back();
        }
      });
  };

  return (
    <View className="flex-1 bg-white p-4 flex justify-between">
      <View className="flex-row flex-1">
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
            // multiline={true}
            // numberOfLines={1}
          />

          <Divider />

          <TextInput
            value={content}
            onChangeText={(content) => setContent(content)}
            placeholder="What's on your mind?"
            className="flex-1 w-full p-2"
            multiline={true}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={140}
        className="flex-row gap-x-2">
        <TouchableOpacity
          className="flex-grow items-center px-4 py-2 bg-[#ffd455] rounded-2xl"
          onPress={() => onSubmit()}>
          <Text className="text-white">Post</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default moadal;
