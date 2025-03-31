import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Appearance,
  Alert,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { ChevronLeft, LogOut, Trash } from "lucide-react-native";
import { useAuth } from "./helpers/AuthContext";
import axios from "axios";

const colorScheme = Appearance.getColorScheme();
const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const menu = () => {
  const { logout, authState } = useAuth();

  async function deleteAccount(id: number) {
    const response = await axios.delete(`http://${serverip}:6969/users/${id}`);

    if (response.data.error)
      return Alert.alert(
        "Error deleting account",
        "We are having trouble deleting your account, please try again later"
      );
    else Alert.alert("Done!", "Your Account has been deleted successfully");

    logout();
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 p-4 pb-4 justify-between items-center flex-row border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={colorScheme === "dark" ? "white" : "black"}
            size={28}
          />
        </TouchableOpacity>

        <View className="flex-grow justify-center items-center">
          <Text className="dark:text-white">Settings and Activity</Text>
        </View>

        {/* placeholder for the right placement of header */}
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft
            color={"transparent"}
            size={28}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center p-4 gap-y-4">
        <TouchableOpacity
          onPress={logout}
          className="w-full flex-row gap-x-2 items-center justify-center">
          <LogOut color={"#f87171"} />

          <Text className="text-lg text-[#f87171]">Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Delete your Account forever?",
              "Are you sure you want to delete your account?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: () => deleteAccount(authState.id),
                  style: "destructive",
                },
              ]
            )
          }
          className="w-full flex-row gap-x-2 items-center justify-center">
          <Trash color={"#870000"} />

          <Text className="text-lg text-[#870000]">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default menu;
