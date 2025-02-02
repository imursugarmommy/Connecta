import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";

import PostTemplate from "../../components/PostTemplate";
import { router } from "expo-router";

import axios from "axios";

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  comments: number;
  likes: number;
};

export default function HomeScreen() {

  const [posts, setPosts] = useState<Post[]>([]);
  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  useEffect(() => {
    axios.get(`http://${serverip}:6969/posts`,)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
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
      <View
        className="h-px w-4/5"
        lightColor="#eee"
        darkColor="rgb(255, 255, 255)"
      />
      <ScrollView className="w-full h-full p-4">
      {posts.length === 0 ? (
          <View className="w-full bg-red-200 mb-6 rounded-md overflow-hidden">
            <View className="w-full p-3 justify-center items-center flex">
              <Text className="text-2xl text-black dark:text-white">Keine Posts gefunden</Text>
            </View>
          </View>
        ) : (
          posts.map((post) => (
            <TouchableOpacity
              onPress={() => router.push(`/post/${post.id}` as any)}
              key={post.id}>
              <PostTemplate post={post} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
