import { View, Text } from "react-native";
import React from "react";
import { Post } from "../types/Post";
import { useAuth } from "@/app/helpers/AuthContext";

import { Trash2 } from "lucide-react-native";

const PostTemplate = ({ post }: { post: Post }) => {
  const { authState } = useAuth();

  return (
    <View className="w-full bg-red-200 mb-6 rounded-md overflow-hidden">
      <View className="w-full bg-gray-500 p-3 flex-row justify-between items-center">
        <Text className="text-2xl text-white">{post.title}</Text>

        {authState.username === post.username && (
          <Trash2
            size={18}
            color="white"
          />
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
          <Text className="mr-4 text-white">
            Kommentare: {post.Comments ? post.Comments.length : 0}
          </Text>
          <Text className="text-white">
            Likes: {post.Likes ? post.Likes.length : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostTemplate;
