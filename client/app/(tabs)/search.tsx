import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Divider from "@/components/ui/Divider";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { router } from "expo-router";
import PostTemplate from "@/components/PostTemplate";
import { Post } from "@/types/Post";
import { Search, Vault, X } from "lucide-react-native";
import { useAuth } from "../helpers/AuthContext";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

export default function SearchScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const colorScheme = useColorScheme();
  const { authState } = useAuth();

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
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="p-4 w-full dark:text-white rouned-xl flex-row">
        {authState.state && (
          <View className="flex-row items-center mr-4">
            {authState.profileImage ? (
              <Image
                source={{
                  uri: `http://${serverip}:6969/images/users/${authState.profileImage}`,
                }}
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <View
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `hsl(${authState.id}, 40%, 40%)`,
                }}>
                <Text className="text-white text-xl">
                  {authState.name?.split("")[0].toUpperCase() || ""}
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="flex-row flex-grow items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-3 h-10">
          <Search
            strokeWidth={1.6}
            size={20}
            color={colorScheme === "dark" ? "white" : "gray"}
            style={{ marginRight: 10 }}
          />

          <TextInput
            className="dark:text-white h-full flex-1 p-0 text-base"
            placeholder="Nach was suchst du diesmal?"
            placeholderTextColor={colorScheme === "dark" ? "white" : "gray"}
            onChangeText={updateSearch}
            value={search}
          />

          {search && (
            <TouchableOpacity
              onPress={() => updateSearch("")}
              className="p-1 rounded-full"
              style={{ backgroundColor: "gray" }}>
              <X
                color={"#e5e7eb"}
                size={10}
              />
            </TouchableOpacity>
          )}
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
            <View key={post.id}>
              <TouchableOpacity
                onPress={() => router.push(`/post/${post.id}` as any)}>
                <PostTemplate post={post} />
              </TouchableOpacity>

              <Divider orientation="horizontal" />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
