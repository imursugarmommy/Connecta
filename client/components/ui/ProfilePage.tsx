import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { useAuth } from "@/app/helpers/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

import axios from "axios";
import PostTemplate from "../PostTemplate";
import { Post } from "@/types/Post";
import { ScrollView } from "react-native-gesture-handler";
import TabSwitcher from "./TabSwitcher";

import UserHeader from "./UserHeader";
import { User } from "@/types/User";

function ProfilePage({ user }: { user: User }) {
  const { authState } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userLikes, setUserLikes] = useState<Post[]>([]);

  const { id: username } = useLocalSearchParams();
  const isYourProfile = authState.username === username || !username;

  const [activeTab, setActiveTab] = useState("Posts");

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  useEffect(() => {
    axios
      .get(`http://${serverip}:6969/posts/byuserid/${user.id}`)
      .then((res) => {
        setUserPosts(res.data);
      });

    if (!isYourProfile) return;

    // * get post id from likes and get posts from postid
    axios
      .get(`http://${serverip}:6969/likes/byuserid/${user.id}`)
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
      <View className="mb-4">
        <UserHeader
          user={user}
          isYourProfile={isYourProfile}
        />
      </View>

      {isYourProfile && (
        <View className="mb-4">
          <TabSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>
      )}

      {activeTab === "Posts" && (
        <View className="w-full">
          {userPosts.map((post: Post) => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/post/${post.id}`)}
                key={post.id}
                className="mb-4">
                <PostTemplate
                  post={post}
                  handleSnapPress={() => {}}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeTab === "Likes" && (
        <View className="w-full">
          {userLikes.map((post: Post) => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/post/${post.id}`)}
                key={post.id}
                className="mb-4">
                <PostTemplate
                  post={post}
                  handleSnapPress={() => {}}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

export default ProfilePage;
