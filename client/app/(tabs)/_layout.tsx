import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { router, Tabs } from "expo-router";


import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import CheckAuth from "../helpers/CheckAuth";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

<CheckAuth>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <FontAwesome6
              name="house"
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Suche",
          tabBarIcon: () => (
            <Octicons
              name="search"
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/modals/modal");
          },
        }}
        options={{
          title: "Add",
          tabBarIcon: () => (
            <FontAwesome6
              name="house"
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: () => (
            <FontAwesome
              name="user"
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <FontAwesome
              name="user"
              size={24}
              color="white"
            />
          ),
        }}
      />
    </Tabs>
    </CheckAuth>
  );
}
