import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, Pencil, Share } from "lucide-react-native";
import { User } from "@/types/User";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserStats from "./UserStats";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const UserHeader = ({
  user,
  isYourProfile,
}: {
  user: User;
  isYourProfile: boolean;
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [following, setFollowing] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const profileImage = await AsyncStorage.getItem("profileImage");

      if (isYourProfile) setProfileImage(profileImage);
      else setProfileImage(user.profileImage);
    })();

    (async () => {
      const following = await axios.get(
        `http://${serverip}:6969/follows/${user.id}`,
        {
          headers: {
            accessToken: await AsyncStorage.getItem("accessToken"),
          },
        }
      );

      if (following.data.error) return console.error("Error getting following");

      setFollowing(following.data.following);
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

  // TODO: Implement shareProfile and editProfile

  function shareProfile() {}

  function editProfile() {}

  async function handleFollow() {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const response = await axios.post(
      `http://${serverip}:6969/follows/${user.id}`,
      {},
      {
        headers: {
          accessToken,
        },
      }
    );

    if (response.data.error) return console.error("Error following user");

    setFollowing(response.data.following);
  }

  return (
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
                  backgroundColor: `hsl(${user.id}, 40%, 40%)`,
                }}>
                <Text className="text-white text-4xl">
                  {user?.name?.split("")[0]}
                </Text>
              </View>
            )}
          </View>

          {isYourProfile && (
            <TouchableOpacity
              onPress={isYourProfile ? editProfilePicture : () => {}}
              className="p-1 border-4 border-white bg-gray-200 dark:bg-[#414450] rounded-full absolute -bottom-1 -right-1">
              <Camera
                color={"black"}
                size={16}
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-grow flex-wrap">
          <Text className="text-black dark:text-white text-3xl font-bold">
            @{user.username}
          </Text>

          <UserStats user={user} />
        </View>
      </View>

      <View className="w-full flex-row justify-between gap-x-2">
        {isYourProfile && (
          <TouchableOpacity
            className="flex-row flex-1 justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-2"
            onPress={editProfile}>
            <Text className="text-md text-black dark:text-white mr-2">
              Edit Profile
            </Text>
            <Pencil
              size={15}
              color={"black"}
            />
          </TouchableOpacity>
        )}

        {!isYourProfile && (
          <TouchableOpacity
            className="flex-row flex-1 justify-center items-center bg-[#FFD343] rounded-lg py-2"
            style={{
              backgroundColor: following ? "white" : "#FFD343",
              borderWidth: following ? 1 : 0,
              borderColor: following ? "#ededed" : "white",
            }}
            onPress={handleFollow}>
            <Text
              className="text-md mr-2"
              style={{ color: following ? "black" : "white" }}>
              {following ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="flex-row flex-1 justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-2"
          onPress={shareProfile}>
          <Text className="text-md text-black dark:text-white mr-2">
            Share Profile
          </Text>
          <Share
            size={15}
            color={"black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserHeader;
