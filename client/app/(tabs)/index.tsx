import { ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";

import PostTemplate from "../../components/PostTemplate";
import { Link, router } from "expo-router";
import Divider from "@/components/ui/Divider";

import { useAuth } from "./../helpers/AuthContext";
import { usePosts } from "../helpers/PostContext";
import axios from "axios";
import { Post } from "../../types/Post";

export default function HomeScreen() {
  const { postState, setPostState } = usePosts();

  const { logout, authState } = useAuth();
  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  useEffect(() => {
    axios.get(`http://${serverip}:6969/posts`).then((res) => {
      setPostState(res.data);
    });
  }, []);

  return (
    <View className="flex-1 items-center">
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

      <Divider orientation="horizontal" />

      <ScrollView className="w-full h-full p-4">
        {postState.map((post: Post, index: number) => (
          <TouchableOpacity
            onPress={() => router.push(`/post/${post.id}` as any)}
            key={post.id || index}>
            <PostTemplate
              post={post}
              postState={postState}
              setPostState={setPostState}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
