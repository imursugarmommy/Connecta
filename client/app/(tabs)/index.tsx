import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";

import PostTemplate from "../../components/PostTemplate";
import { router } from "expo-router";

export default function HomeScreen() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Eilmeldung",
      content: "Younes ist schwul",
      username: "Dragoneisbaer",
      comments: 30,
      likes: 5000,
    },
    {
      id: 2,
      title: "Post 2",
      content: "Content 2",
      username: "User 2",
      comments: 2,
      likes: 10,
    },
    {
      id: 3,
      title: "Post 3",
      content: "Content 3",
      username: "User 3",
      comments: 0,
      likes: 0,
    },
    {
      id: 4,
      title: "Post 4",
      content: "Content 1",
      username: "User 1",
      comments: 0,
      likes: 0,
    },
    {
      id: 5,
      title: "Post 5",
      content: "Content 1",
      username: "User 1",
      comments: 0,
      likes: 5,
    },
  ]);

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
      <View
        className="h-px w-4/5"
        lightColor="#eee"
        darkColor="rgb(255, 255, 255)"
      />
      <ScrollView className="w-full h-full p-4">
        {posts.map((post) => (
          <TouchableOpacity
            onPress={() => router.push(`/post/${post.id}` as any)}
            key={post.id}>
            <PostTemplate post={post} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
