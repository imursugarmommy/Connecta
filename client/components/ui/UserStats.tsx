import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@/types/User";
import axios from "axios";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const UserStats = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const postResponse = await axios.get(
        `http://${serverip}:6969/posts/byuserid/${user.id}`
      );

      setPosts(postResponse.data.length);
    })();

    (async () => {
      const followersResponse = await axios.get(
        `http://${serverip}:6969/follows/followers/${user.id}`
      );

      setFollowers(followersResponse.data.length);
    })();

    (async () => {
      const followingResponse = await axios.get(
        `http://${serverip}:6969/follows/following/${user.id}`
      );

      setFollowing(followingResponse.data.length);
    })();
  }, []);

  return (
    <View className="flex-row flex-grow justify-between items-center">
      <View className="flex items-center">
        <Text className="text-lg">{posts}</Text>
        <Text className="font-bold">Posts</Text>
      </View>
      <View className="flex items-center">
        <Text className="text-lg">{followers}</Text>
        <Text className="font-bold">Follower</Text>
      </View>
      <View className="flex items-center">
        <Text className="text-lg">{following}</Text>
        <Text className="font-bold">Following</Text>
      </View>
    </View>
  );
};

export default UserStats;
