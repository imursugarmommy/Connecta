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

  const calcTime = () => {
    const postDate = new Date(post.createdAt);
    const currentDate = new Date();
    const time = Math.floor(
      (currentDate.getTime() - postDate.getTime()) / 1000
    );

    if (time < 60) return "now";
    if (time < 3600) return `${Math.floor(time / 60)}min`;
    if (time < 86400) return `${Math.floor(time / 3600)}h`;
    if (time < 604800) return `${Math.floor(time / 86400)}d`;
    if (time < 2628000) return `${Math.floor(time / 604800)}w`;
    if (time < 31536000) return `${Math.floor(time / 2628000)}m`;
    if (time >= 31536000) return `${Math.floor(time / 31536000)}y`;

    return time;
  };

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
          <View>
            <View className="flex-row items-center gap-x-2 text-sm">
              <View>
                {user ? (
                  <Text className="text-lg text-[#FFD343] font-bold">
                    {user.name}
                  </Text>
                ) : (
                  <View className="w-28 py-2.5 rounded-full bg-gray-200" />
                )}
                {user ? (
                  <Text className="text-xs text-gray-300 leading-3">
                    @{user.username}
                  </Text>
                ) : (
                  <View className="w-20 py-2 rounded-full bg-gray-200" />
                )}
              </View>

              <View className="h-1 w-1 rounded-full bg-gray-300" />

              <View>
                <Text className="text-xs text-gray-300">{calcTime()}</Text>
              </View>
            </View>
          </View>
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
