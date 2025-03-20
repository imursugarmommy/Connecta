import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState, memo } from "react";
import { User } from "@/types/User";
import axios from "axios";
import { useAuth } from "@/app/helpers/AuthContext";
import { usePosts } from "@/app/helpers/PostContext";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { Post } from "@/types/Post";
import RenderHTML from "react-native-render-html";

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

  return (
    <View>
      <View className="w-full flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center gap-x-4"
          onPress={() => router.push(`/user/${user?.username}` as any)}>
          {user && user.profileImage ? (
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
                backgroundColor: `hsl(${user ? user.id : 0}, 40%, 40%)`,
              }}>
              <Text className="text-white text-xl">
                {user?.name?.split("")[0].toUpperCase() || ""}
              </Text>
            </View>
          )}
          {user ? (
            <Text className="text-xl text-black">{user.name}</Text>
          ) : (
            <View className="w-28 py-2.5 rounded-full bg-gray-200" />
          )}
          {user ? (
            <Text className="text-sm text-gray-500">@{user.username}</Text>
          ) : (
            <View className="w-20 py-2 rounded-full bg-gray-200" />
          )}
        </TouchableOpacity>

        {authState.id === post.UserId && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Post",
                "Are you sure you want to delete this post?",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => removeItem(post.id),
                    style: "destructive",
                  },
                ]
              );
            }}>
            <Trash2
              size={18}
              color="#D9D9D9"
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

          <RenderHTML
            contentWidth={500}
            source={{ html: post.content }}
          />
        </View>
      </View>
    </View>
  );
});

export default PostContent;
