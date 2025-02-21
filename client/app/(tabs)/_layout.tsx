import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { Link, router, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import CheckAuth from "../helpers/CheckAuth";

import { Home, Search, Plus, Send, UserRound } from "lucide-react-native";
import Headers from "@/components/ui/Headers";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CheckAuth>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home color={color} />,
            header: () => (
              <Headers
                title="Home"
                style={{ paddingTop: 50 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Suche",
            tabBarIcon: ({ color }) => <Search color={color} />,
            header: () => (
              <Headers
                title="Search"
                style={{ paddingTop: 50 }}
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
            tabBarLabelStyle: { display: "none" },
            tabBarIconStyle: {
              backgroundColor: "#FFD343",
              height: 50,
              width: 50,
              borderRadius: "50%",
              transform: [{ translateY: -10 }],
            },
            tabBarIcon: () => <Plus color={"white"} />,
            header: () => (
              <Headers
                title="Add"
                style={{ paddingTop: 50 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => <Send color={color} />,
            header: () => (
              <Headers
                title="Messages"
                style={{ paddingTop: 50 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <UserRound color={color} />,
            header: () => (
              <Headers
                title="Profile"
                style={{ paddingTop: 50 }}
                icon={true}
              />
            ),
            headerTitleContainerStyle: { backgroundColor: "transparent" },
          }}
        />
      </Tabs>
    </CheckAuth>
  );
}
