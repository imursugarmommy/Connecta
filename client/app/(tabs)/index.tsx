import { ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useEffect, useCallback, useRef, useState } from "react";

import PostTemplate from "../../components/PostTemplate";
import { Link, router } from "expo-router";
import Divider from "@/components/ui/Divider";
import LoginReminder from "@/components/ui/LoginReminder";
import BottomSheet from "@gorhom/bottom-sheet";

import { useAuth } from "./../helpers/AuthContext";
import { usePosts } from "../helpers/PostContext";
import axios from "axios";
import { Post } from "../../types/Post";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheetComponent from "@/components/ui/BottomSheetComponent";

export default function HomeScreen() {
  const { postState, setPostState } = usePosts();

  const { logout, authState } = useAuth();
  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  const snapPoints = ["40%"];

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    axios.get(`http://${serverip}:6969/posts`).then((res) => {
      setPostState(res.data);
    });
  }, []);

  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isOpen ? "rgba(0,0,0,0.2)" : "transparent",
      opacity: opacity.value,
    };
  });

  return (
    <View className="flex-1 items-center relative">
      <Animated.View
        className="absolute top-0 left-0 w-full h-full z-10"
        style={animatedStyle}
        pointerEvents={isOpen ? "auto" : "none"}
      />

      <View
        className="h-3"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View className="w-full p-4 items-center">
        <Text className="text-2xl font-bold">Neue Posts für dich</Text>
      </View>

      <Divider orientation="horizontal" />

      {authState.state ? (
        <Text>{JSON.stringify(authState, null, 2)}</Text>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="text-blue-500 my-4">
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="text-blue-500 my-4">
            Register
          </Link>
        </>
      )}

      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/user/lelv2" as any)}>
        <Text>User Page lelv2</Text>
      </TouchableOpacity>

      <Divider orientation="horizontal" />

      <ScrollView className="w-full h-full p-4">
        {postState.map((post: Post, index: number) => (
          <TouchableOpacity
            onPress={() => router.push(`/post/${post.id}` as any)}
            key={post.id || index}>
            <PostTemplate
              post={post}
              handleSnapPress={handleSnapPress}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isOpen && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={snapPoints}
          isOpen={isOpen}
          setIsOpen={setIsOpen}>
          <LoginReminder />
        </BottomSheetComponent>
      )}
    </View>
  );
}
