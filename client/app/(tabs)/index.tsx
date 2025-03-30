import { ScrollView, TouchableOpacity, RefreshControl } from "react-native";

import { Text, View } from "@/components/Themed";
import { useEffect, useCallback, useRef, useState } from "react";
import React from "react";

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

import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed",
]);

export default function HomeScreen() {
  const { postState, setPostState } = usePosts();

  const [refreshing, setRefreshing] = React.useState(false);

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true); // Show the refresh indicator
    axios
      .get(`http://${serverip}:6969/posts`)
      .then((res) => {
        setPostState(res.data); // Update the posts
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => {
        setRefreshing(false); // Hide the refresh indicator
      });
  }, [serverip, setPostState]);

  const { logout, authState } = useAuth();

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

      <ScrollView className="w-full h-full p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        
        {postState.map((post: Post, index: number) => (
          <View
            key={Date.now() + index}
            className="mb-4">
            <TouchableOpacity
              onPress={() => router.push(`/post/${post.id}` as any)}>
              <PostTemplate
                post={post}
                handleSnapPress={handleSnapPress}
              />
            </TouchableOpacity>

            <Divider orientation="horizontal" />
          </View>
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
