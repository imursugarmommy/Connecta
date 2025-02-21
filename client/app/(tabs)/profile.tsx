import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import { Pencil, Share, UserRound } from "lucide-react-native";
import Divider from "../../components/ui/Divider";
import axios from "axios";
import PostTemplate from "@/components/PostTemplate";
import { Post } from "@/types/Post";
import { ScrollView } from "react-native-gesture-handler";

function ProfilePage() {
  const { authState } = useAuth();
  const [userPosts, setUserPosts] = useState([]);

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  if (!authState.state) router.push("/auth/login");

  function editProfilePicture() {}

  function shareProfile() {}

  function editProfile() {}

  useEffect(() => {
    axios
      .get(`http://${serverip}:6969/posts/byuserid/${authState.id}`)
      .then((res) => {
        setUserPosts(res.data);
      });
  }, []);

  return (
    <ScrollView className="flex-1 p-4 px-6 bg-white dark:bg-black">
      <View className="flex gap-y-2 items-center">
        <View className="flex-row w-full mb-2">
          <TouchableOpacity
            onPress={editProfilePicture}
            className="justify-center mr-4">
            <View className="h-20 w-20 items-center justify-end bg-gray-200 rounded-full">
              <UserRound
                size={55}
                color={"white"}
              />
            </View>
          </TouchableOpacity>

          <View className="flex-grow flex-wrap">
            <Text className="text-black dark:text-white text-3xl font-bold">
              @{authState.username}
            </Text>

            <View className="flex-row flex-grow justify-between items-center">
              <View className="flex items-center">
                <Text className="text-lg">13</Text>
                <Text className="font-bold">Posts</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-lg">96</Text>
                <Text className="font-bold">Follower</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-lg">126</Text>
                <Text className="font-bold">Following</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="w-full flex-row justify-between gap-x-2">
          <TouchableOpacity className="flex-row flex-grow justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1">
            <Text className="text-lg text-black dark:text-white mr-2">
              Edit Profile
            </Text>
            <Pencil
              size={15}
              color={"black"}
            />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row flex-grow justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1">
            <Text className="text-lg text-black dark:text-white mr-2">
              Share Profile
            </Text>
            <Share
              size={15}
              color={"black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="my-4">
        <Divider
          orientation="horizontal"
          text="Your Posts"
        />
      </View>

      <View className="w-full">
        {userPosts.map((post: Post) => {
          return (
            <View
              key={post.id}
              className="mb-4">
              <PostTemplate
                post={post}
                handleSnapPress={() => {}}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default ProfilePage;
