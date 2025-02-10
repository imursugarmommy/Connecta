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

const moadal = () => {
  const textInputRef = useRef<TextInput>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const onSubmit = () => {
    if (!text) return;

    router.back();
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
        <TextInput
          ref={textInputRef}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="What's on your mind?"
          className="ml-4 flex-1"
          multiline={true}
        />
      </View>

      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={140}
        className="flex-row gap-x-2">
        <View className="flex-grow bg-gray-100 p-2 rounded-md">
          <Text>ToolBox</Text>
        </View>

        <TouchableOpacity
          className="px-4 py-2 bg-[#ffd455] rounded-2xl"
          onPress={() => onSubmit()}>
          <Text className="text-white">Post</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default moadal;
