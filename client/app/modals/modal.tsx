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
import { usePosts } from "../helpers/PostContext";

import Divider from "@/components/ui/Divider";

import { ImagePlus, Bold, Italic, Underline, List } from "lucide-react-native";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const Modal = () => {
  const textInputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeButtons, setActiveButtons] = useState<string[]>([]);

  const { addItem } = usePosts();

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const onSubmit = async (data: { title: string; content: string }) => {
    if (!content || !title) return;

    addItem(data);

    if (router.canGoBack()) router.back();
  };

  const toggleButton = (button: string) => {
    setActiveButtons((prev) =>
      prev.includes(button)
        ? prev.filter((b) => b !== button)
        : [...prev, button]
    );
  };

  return (
    <View className="flex-1 bg-white flex justify-between">
      <View className="flex-row m-4">
        <Image
          source={require("../../assets/images/favicon.png")}
          style={{
            height: 30,
            width: 30,
            borderRadius: "50%",
            resizeMode: "contain",
          }}
        />
        <View className="flex-1">
          <TextInput
            ref={textInputRef}
            value={title}
            onChangeText={(title) => setTitle(title)}
            placeholder="What's do you want to talk about?"
            className="p-2 w-full text-sm font-semibold h-10"
          />

          <Divider orientation="horizontal" />

          <TextInput
            value={content}
            onChangeText={(content) => setContent(content)}
            placeholder="What's on your mind?"
            className="max-w-full p-2 h-60"
            multiline={true}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={130}
        className="absolute bottom-0 w-full">
        {/* progress bar for word count */}
        <View
          className="h-1 bg-[#ffd455]"
          style={{ width: "70%" }}></View>

        <View className="flex-row w-full justify-between items-center p-2 bg-gray-100">
          <View className="flex-row flex-grow items-center justify-between">
            <TouchableOpacity className="p-2">
              <ImagePlus color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-2 ${
                activeButtons.includes("Bold") ? "bg-gray-300" : ""
              } rounded-sm`}
              onPress={() => toggleButton("Bold")}>
              <Bold color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-2 ${
                activeButtons.includes("Italic") ? "bg-gray-300" : ""
              } rounded-sm`}
              onPress={() => toggleButton("Italic")}>
              <Italic color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-2 ${
                activeButtons.includes("Underline") ? "bg-gray-300" : ""
              } rounded-sm`}
              onPress={() => toggleButton("Underline")}>
              <Underline color="black" />
            </TouchableOpacity>

            <TouchableOpacity className="p-2">
              <List color="black" />
            </TouchableOpacity>
          </View>

          <View>
            <Divider orientation="vertical" />
          </View>

          <TouchableOpacity
            className="items-center p-8 py-2 bg-[#ffd455] rounded-2xl "
            onPress={() => onSubmit({ title, content })}>
            <Text className="text-white">Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
