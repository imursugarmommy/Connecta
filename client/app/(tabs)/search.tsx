import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import PostTemplate from "@/components/PostTemplate";
import { Post } from "@/types/Post";
import { Search } from "lucide-react-native";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

export default function SearchScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const colorScheme = useColorScheme();

  // * nice idea but when parent header is changed every tabs header changes
  // ? maybe there is a good solution, havent found yet
  // const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     headerShown: true,
  //     headerLargeTitle: true,
  //     headerTitle: "Suche",
  //     headerSearchBarOptions: {
  //       placeholder: "Search",
  //       autoCapitalize: "none",
  //       onChangeText: (event: any) => {
  //         const searchText = event.nativeEvent.text;
  //         updateSearch(searchText);
  //       },
  //     },
  //   });
  // }, [navigation]);

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
      <View className="m-2 p-4 w-full dark:text-white rouned-xl">
        <View className="flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-3 h-10">
          <Search
            strokeWidth={1.6}
            size={20}
            color={colorScheme === "dark" ? "white" : "gray"}
            style={{ marginRight: 10 }}
          />

          <TextInput
            className="dark:text-white h-full p-0 w-full text-base"
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
