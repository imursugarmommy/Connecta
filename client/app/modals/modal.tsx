import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { router } from "expo-router";
import { usePosts } from "../helpers/PostContext";
import * as ImagePicker from "expo-image-picker";
import { Appearance } from "react-native";

import Divider from "@/components/ui/Divider";

import { ImagePlus, Bold, Italic, Underline, X } from "lucide-react-native";
import { useAuth } from "../helpers/AuthContext";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;
const colorScheme =  Appearance.getColorScheme();

const Modal = () => {
  const textInputRef = useRef<TextInput>(null);
  const richTextRef = useRef<RichEditor>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const maxLength = 320;

  const { authState } = useAuth();
  const { addItem } = usePosts();

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, []);

  const getPlainTextLength = (html: string) => {
    const plainText = html.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return plainText.length;
  };

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted")
      return alert("Sorry, we need camera roll permissions to make this work!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black flex justify-between">
      <View className="flex-row m-4">
        {authState.profileImage ? (
          <Image
            source={{
              uri: `http://${serverip}:6969/images/users/${authState.profileImage}`,
            }}
            className="w-8 h-8 rounded-full object-contain bg-gray-200"
          />
        ) : (
          <View
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `hsl(${authState.id}, 40%, 40%)`,
            }}>
            <Text className="text-white text-xl">
              {authState.name.split("")[0].toUpperCase() || ""}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <TextInput
            ref={textInputRef}
            value={title}
            onChangeText={(title) => setTitle(title)}
            placeholder="What do you want to talk about?"
            placeholderTextColor={colorScheme === "dark" ? "white" : "gray"}
            className="p-2 w-full text-sm font-semibold h-10 dark:text-white"
            maxLength={60}
          />

          <Divider orientation="horizontal" />

          {Platform.OS === "ios" ? (
            <RichEditor
              ref={richTextRef}
              initialContentHTML={content}
              onChange={(html) => {
                const plainTextLength = getPlainTextLength(html);

                if (plainTextLength <= maxLength) setContent(html);
                else richTextRef.current?.setContentHTML(content);
              }}
              placeholder="What's on your mind?"
              style={{ height: image ? "auto" : 240 }}
              editorStyle={{
                backgroundColor: "#fff",
                placeholderColor: "#aaa",
                contentCSSText: "font-size: 14px; padding: 10px;",
              }}
            />
          ) : (
            <TextInput
              multiline
              value={content}
              onChangeText={(content) => {
                const plainTextLength = getPlainTextLength(content);

                if (plainTextLength <= maxLength) setContent(content);
              }}
              placeholder="What's on your mind?"
              placeholderTextColor={colorScheme === "dark" ? "white" : "gray"}
              className="p-2 w-full h-40 dark:text-white"
              textAlignVertical="top"
              maxLength={maxLength}
            />
          )}

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

      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={130}
        className="absolute bottom-0 w-full">
        <View
          className="h-1 bg-[#ffd455]"
          style={{
            width: `${(getPlainTextLength(content) / maxLength) * 100}%`,
          }}
        />

        <View className="flex-row w-full px-2 bg-gray-100">
          <View className="flex-1 flex-row justify-between items-center gap-x-2 dark:bg-black">
            <TouchableOpacity
              className="p-2"
              onPress={pickImage}>
              <ImagePlus color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <RichToolbar
                editor={richTextRef}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                ]}
                iconMap={{
                  [actions.setBold]: () => <Bold color="black" />,
                  [actions.setItalic]: () => <Italic color="black" />,
                  [actions.setUnderline]: () => <Underline color="black" />,
                }}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  padding: 4,
                }}
                selectedButtonStyle={{
                  backgroundColor: "#d1d5db",
                  borderRadius: 4,
                  marginHorizontal: 12,
                }}
                unselectedButtonStyle={{
                  marginHorizontal: 12,
                }}
              />
            )}
            <TouchableOpacity
              className="items-center p-8 py-2 bg-[#ffd455] dark:bg-[ffd455] rounded-2xl "
              onPress={() => onSubmit()}>
              <Text className="text-white dark:text-black">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
