import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { router } from "expo-router";
import PostTemplate from "@/components/PostTemplate";
import { Octicons } from "@expo/vector-icons";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  comments: number;
  likes: number;
};

export default function SearchScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    axios
      .get(`http://${serverip}:6969/posts`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateSearch = (search: string) => {
    setSearch(search);
    axios
      .get(`http://${serverip}:6969/posts`, { params: { searchparam: search } })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View className="m-4 p-4 w-full dark:text-white rouned-xl">
        <View className="flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-3 h-7">
          <Octicons
            name="search"
            size={14}
            color={colorScheme === "dark" ? "white" : "gray"}
            style={{ marginRight: 10 }}
          />

          <TextInput
            className="dark:text-white h-full p-0 w-full"
            placeholder="Nach was suchst du diesmal?"
            placeholderTextColor={colorScheme === "dark" ? "white" : "gray"}
            onChangeText={updateSearch}
            value={search}
          />
        </View>
      </View>
      <ScrollView className="w-full h-full p-4">
        {posts.length === 0 ? (
          <View className="w-full bg-red-200 mb-6 rounded-md overflow-hidden">
            <View className="w-full p-3 justify-center items-center flex">
              <Text className="text-xl text-black dark:text-white">
                {search === ""
                  ? "Keine Posts gefunden"
                  : `Keine Posts mit dem Content "${search}" gefunden`}
              </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
