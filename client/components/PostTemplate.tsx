import { View, Text } from "react-native";
import React from "react";

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  comments: number;
  likes: number;
}

const Post = ({ post }: { post: Post }) => {
  return (
    <View className="w-full bg-red-200 mb-6 rounded-md overflow-hidden">
      <View className="w-full bg-gray-500 p-3">
        <Text className="text-2xl text-white">{post.title}</Text>
      </View>
      <View className="w-full bg-white dark:bg-[#242732] h-32 items-center justify-center">
        <Text className="text-xl dark:text-white">{post.content}</Text>
      </View>
      <View className="w-full flex-row bg-gray-500 p-3">
        <View className="bg-transparent">
          <Text className="text-white">{post.username}</Text>
        </View>
        <View className="flex-grow flex-row justify-end bg-transparent">
          <Text className="mr-4 text-white">Kommentare: {post.comments}</Text>
          <Text className="text-white">Likes: {post.likes}</Text>
        </View>
      </View>
    </View>
  );
};

export default Post;
