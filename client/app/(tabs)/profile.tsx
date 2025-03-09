import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { useAuth } from "../helpers/AuthContext";
import { router } from "expo-router";

import { Camera, Pencil, Share } from "lucide-react-native";
import axios from "axios";
import PostTemplate from "@/components/PostTemplate";
import { Post } from "@/types/Post";
import { ScrollView } from "react-native-gesture-handler";
import TabSwitcher from "./../../components/ui/TabSwitcher";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ProfilePage() {
  const { authState, setAuthState } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userLikes, setUserLikes] = useState<Post[]>([]);

  const [activeTab, setActiveTab] = useState("Posts");

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  if (!authState.state) router.push("/auth/login");

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const profileImage = await AsyncStorage.getItem("profileImage");
      setProfileImage(profileImage);
    })();
  }, []);

  async function editProfilePicture() {
    // get image from gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted")
      return alert("Sorry, we need camera roll permissions to make this work!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const image = result.assets[0].uri;
    const formData = new FormData();

    const fileName = image.split("/").pop();
    const fileType = image.split(".").pop();
    const file = {
      uri: image,
      name: fileName,
      type: `image/${fileType}`,
    };
    formData.append("profileImage", file as any);

    const response = await axios.post(
      `http://${serverip}:6969/users/picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          accessToken: await AsyncStorage.getItem("accessToken"),
        },
      }
    );

    if (response.data.error)
      return alert(
        "We are having trouble uploading your image. Please try again later."
      );

    setProfileImage(response.data.profileImage);

    await AsyncStorage.setItem("profileImage", response.data.profileImage);
  }

  function shareProfile() {}

  function editProfile() {}

  useEffect(() => {
    axios
      .get(`http://${serverip}:6969/posts/byuserid/${authState.id}`)
      .then((res) => {
        setUserPosts(res.data);
      });

    // * get post id from likes and get posts from postid
    axios
      .get(`http://${serverip}:6969/likes/byuserid/${authState.id}`)
      .then(async (res) => {
        const likes = res.data;
        const posts = await Promise.all(
          likes.map(async (like: any) => {
            const postRes = await axios.get(
              `http://${serverip}:6969/posts/byid/${like.PostId}`
            );
            const post = postRes.data[0];
            post.Likes = [like];
            return post;
          })
        );
        setUserLikes(posts);
      });
  }, []);

  return (
    <ScrollView className="flex-1 p-4 px-6 bg-white dark:bg-black">
      <View className="flex gap-y-2 items-center">
        <View className="flex-row w-full mb-2">
          <View className="relative mr-4">
            <View className="justify-center">
              {profileImage ? (
                <Image
                  source={{
                    uri: `http://${serverip}:6969/images/users/${profileImage}`,
                  }}
                  className="h-20 w-20 items-center justify-end bg-white rounded-full"
                />
              ) : (
                <View
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `hsl(${authState.id}, 40%, 40%)`,
                  }}>
                  <Text className="text-white text-4xl">
                    {authState.name.split("")[0].toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={editProfilePicture}
              className="p-1 border-4 border-white bg-gray-200 dark:bg-[#414450] rounded-full absolute -bottom-1 -right-1">
              <Camera
                color={"black"}
                size={16}
              />
            </TouchableOpacity>
          </View>

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
          <TouchableOpacity
            className="flex-row flex-grow justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1"
            onPress={editProfile}>
            <Text className="text-lg text-black dark:text-white mr-2">
              Edit Profile
            </Text>
            <Pencil
              size={15}
              color={"black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row flex-grow justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1"
            onPress={shareProfile}>
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
        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </View>

      {activeTab === "Posts" && (
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
      )}

      {activeTab === "Likes" && (
        <View className="w-full">
          {userLikes.map((post: Post) => {
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
      )}
    </ScrollView>
  );
}

export default ProfilePage;
