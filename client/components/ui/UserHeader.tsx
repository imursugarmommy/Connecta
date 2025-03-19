import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, Pencil, Share, UserPlus } from "lucide-react-native";
import { User } from "@/types/User";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const UserHeader = ({
  user,
  isYourProfile,
}: {
  user: User;
  isYourProfile: boolean;
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [following, setFollowing] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const profileImage = await AsyncStorage.getItem("profileImage");

      if (isYourProfile) setProfileImage(profileImage);
      else setProfileImage(user.profileImage);
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

  function shareProfile() {}

  function editProfile() {}

  function handleFollow() {
    setFollowing(!following);
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
                  {user.name?.split("")[0].toUpperCase()}
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

          <View className="flex-row flex-grow justify-between items-center">
            <View className="flex items-center">
              <Text className="text-lg">13</Text>
              <Text className="font-bold">Posts</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-lg">96</Text>
              <Text className="font-bold">Follower</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-lg">126</Text>
              <Text className="font-bold">Following</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="w-full flex-row justify-between gap-x-2">
        {isYourProfile && (
          <TouchableOpacity
            className="flex-row flex-1 justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1"
            onPress={editProfile}>
            <Text className="text-lg text-black dark:text-white mr-2">
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
            className="flex-row flex-1 justify-center items-center bg-[#FFD343] rounded-lg py-1"
            style={{
              backgroundColor: following ? "#FFD343" : "white",
              borderWidth: following ? 0 : 1,
              borderColor: following ? "white" : "#ededed",
            }}
            onPress={handleFollow}>
            <Text
              className="text-lg mr-2"
              style={{ color: following ? "white" : "black" }}>
              {following ? "Follow" : "Following"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="flex-row flex-1 justify-center items-center border border-[#ededed] dark:border-[#414450] rounded-lg py-1"
          onPress={shareProfile}>
          <Text className="text-lg text-black dark:text-white mr-2">
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
