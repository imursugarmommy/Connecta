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
import * as ImagePicker from "expo-image-picker";

import Divider from "@/components/ui/Divider";

import {
  ImagePlus,
  Bold,
  Italic,
  Underline,
  List,
  X,
} from "lucide-react-native";

const Modal = () => {
  const textInputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const maxLength = 320;

  const { addItem } = usePosts();

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const onSubmit = async () => {
    if (!content || !title) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      const fileName = image.split("/").pop();
      const fileType = image.split(".").pop();
      const file = {
        uri: image,
        name: fileName,
        type: `image/${fileType}`,
      };
      formData.append("postImage", file as any);
    }

    addItem(formData);

    if (router.canGoBack()) router.back();
  };

  const toggleButton = (button: string) => {
    setActiveButtons((prev) =>
      prev.includes(button)
        ? prev.filter((b) => b !== button)
        : [...prev, button]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted")
      return alert("Sorry, we need camera roll permissions to make this work!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <View className="flex-1 bg-white flex justify-between">
      <View className="flex-row m-4">
        <Image
          source={require("../../assets/images/favicon.png")}
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
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
            maxLength={60}
          />

          <Divider orientation="horizontal" />

          <TextInput
            value={content}
            onChangeText={(content) => setContent(content)}
            placeholder="What's on your mind?"
            className="max-w-full p-2"
            style={{ height: image ? "auto" : 240 }}
            multiline={true}
            maxLength={maxLength}
            textAlignVertical="top"
          />

          {image && (
            <View
              className="relative my-2"
              style={{ height: 100, width: 100 }}>
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-md"
              />

              <TouchableOpacity
                className="absolute top-1 right-1 p-1 rounded-full"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onPress={() => setImage(null)}>
                <X
                  color="white"
                  size={12}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* TODO: fix broken view */}
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={130}
        className="absolute bottom-0 w-full">
        {/* progress bar for word count */}
        <View
          className="h-1 bg-[#ffd455]"
          style={{ width: `${(content.length / maxLength) * 100}%` }}></View>

        <View className="flex-row w-full justify-between items-center p-2 bg-gray-100">
          <View className="flex-row flex-grow items-center justify-between">
            <TouchableOpacity
              className="p-2"
              onPress={pickImage}>
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
            onPress={() => onSubmit()}>
            <Text className="text-white">Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
