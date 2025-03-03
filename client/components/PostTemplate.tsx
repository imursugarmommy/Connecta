import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Post } from "../types/Post";
import { useAuth } from "@/app/helpers/AuthContext";
import { usePosts } from "@/app/helpers/PostContext";

import {
  Trash2,
  ThumbsUp,
  MessageCircle,
  Heart,
  Bookmark,
  Share,
} from "lucide-react-native";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const PostTemplate = ({
  post,
  handleSnapPress,
}: {
  post: Post;
  handleSnapPress?: any;
}) => {
  const { authState } = useAuth();
  const { postState, setPostState, removeItem } = usePosts();

  const addLike = async (id: number) => {
    axios
      .post(
        `http://${serverip}:6969/likes`,
        {
          PostId: id,
        },
        { headers: { accessToken: await AsyncStorage.getItem("accessToken") } }
      )
      .then((res) => {
        if (res.data.error) return handleSnapPress(0);

        setPostState(
          postState.map((post: Post) => {
            if (post.id !== id) return post;

            if (res.data.liked === true) {
              return {
                ...post,
                // pass UserId so we can check for the userId down below where we render the like buttons
                // could pass any item
                Likes: [...post.Likes, { UserId: authState.id }],
              };
            } else {
              const likesArray = post.Likes;
              likesArray.pop();

              return {
                ...post,
                Likes: likesArray,
              };
            }
          })
        );
      });
  };

  return (
    <View className="w-full border-gray-50 mb-6 rounded-md overflow-hidden">
      <View className="w-full flex-row justify-between items-center">
        <View className="flex-row items-center gap-x-4">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-8 h-8 rounded-full"
          />
          <Text className="text-xl text-black">{post.name}</Text>

          <TouchableOpacity
            onPress={() => router.push(`/user/${post.username}` as any)}>
            <Text className="text-sm text-gray-500">@{post.username}</Text>
          </TouchableOpacity>
        </View>

        {authState.id === post.UserId && (
          <TouchableOpacity onPress={() => removeItem(post.id)}>
            <Trash2
              size={18}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="w-full py-2">
        <View className={"flex " + (post.postImage && "gap-y-2")}>
          <Text className="text-lg font-bold">{post.title}</Text>
          {post.postImage && (
            <Image
              source={{
                uri: `http://${serverip}:6969/images/posts/${post.postImage}`,
              }}
              className="w-full h-52 object-cover bg-black"
            />
          )}
          <Text className="text-lg">{post.content}</Text>
        </View>
      </View>
      <View className="w-full flex-row">
        <View className="bg-transparent flex-row items-center">
          <TouchableOpacity
            onPress={() => addLike(post.id)}
            className="flex-row items-center gap-x-1 mr-4">
            <Heart
              fill={
                post.Likes?.some((like) => like.UserId === authState.id)
                  ? "black"
                  : "transparent"
              }
              size={20}
              color={"black"}
            />

            <Text className="text-gray-700">
              {post.Likes ? post.Likes.length : 0}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-x-1">
            <MessageCircle
              size={20}
              color={"black"}
            />
            <Text className="text-gray-700">
              {post.Comments ? post.Comments.length : 0}
            </Text>
          </View>
        </View>
        <View className="flex-grow flex-row justify-end bg-transparent gap-x-3">
          <TouchableOpacity>
            <Share
              color={"black"}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Bookmark
              color={"black"}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostTemplate;
