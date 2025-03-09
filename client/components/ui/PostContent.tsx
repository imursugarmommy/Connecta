import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState, memo } from "react";
import { User } from "@/types/User";
import axios from "axios";
import { useAuth } from "@/app/helpers/AuthContext";
import { usePosts } from "@/app/helpers/PostContext";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { Post } from "@/types/Post";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const PostContent = memo(({ post }: { post: Post }) => {
  const { authState } = useAuth();
  const { removeItem } = usePosts();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const user = axios.get(`http://${serverip}:6969/users/byid/${post.UserId}`);

    user.then((res) => {
      setUser(res.data);
    });
  }, []);

  if (!user)
    return (
      <View className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-lg">
        <Text>Something went wrong...</Text>
      </View>
    );

  return (
    <View>
      <View className="w-full flex-row justify-between items-center">
        <View className="flex-row items-center gap-x-4">
          {user.profileImage ? (
            <Image
              source={{
                uri: `http://${serverip}:6969/images/users/${user.profileImage}`,
              }}
              className="w-8 h-8 rounded-full object-cover bg-gray-200"
            />
          ) : (
            <View
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `hsl(${user.id}, 40%, 40%)`,
              }}>
              <Text className="text-white text-xl">
                {user.name.split("")[0].toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="text-xl text-black">{user.name}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/user/${user.username}` as any)}>
            <Text className="text-sm text-gray-500">@{user.username}</Text>
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
    </View>
  );
});

export default PostContent;
