import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Post } from "../types/Post";
import { useAuth } from "@/app/helpers/AuthContext";
import { usePosts } from "@/app/helpers/PostContext";

import { Trash2, ThumbsUp, MessageCircle } from "lucide-react-native";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

// TODO: handle validation errors
const PostTemplate = ({ post }: { post: Post }) => {
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
    <View className="w-full bg-red-200 mb-6 rounded-md overflow-hidden">
      <View className="w-full bg-gray-500 p-3 flex-row justify-between items-center">
        <Text className="text-2xl text-white">{post.title}</Text>

        {authState.username === post.username && (
          <TouchableOpacity onPress={() => removeItem(post.id)}>
            <Trash2
              size={18}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="w-full bg-white dark:bg-[#242732] h-32 items-center justify-center">
        <Text className="text-xl">{post.content}</Text>
      </View>
      <View className="w-full flex-row bg-gray-500 p-3">
        <View className="bg-transparent">
          <Text className="text-white">{post.username}</Text>
        </View>
        <View className="flex-grow flex-row justify-end bg-transparent">
          <View className="mr-4 flex-row items-center gap-x-1">
            <MessageCircle
              size={16}
              color={"white"}
            />
            <Text className="text-gray-300">
              {post.Comments ? post.Comments.length : 0}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => addLike(post.id)}
            className="flex-row items-center gap-x-1">
            <ThumbsUp
              fill={
                post.Likes.some((like) => like.UserId === authState.id)
                  ? "white"
                  : "transparent"
              }
              size={16}
              color={"white"}
            />

            <Text className="text-gray-300">
              {post.Likes ? post.Likes.length : 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostTemplate;
