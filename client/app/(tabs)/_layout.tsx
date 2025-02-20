import React from "react";
import { router, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import CheckAuth from "../helpers/CheckAuth";

import { Home, Search, Plus, Send, UserRound } from "lucide-react-native";

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
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Suche",
            tabBarIcon: ({ color }) => <Search color={color} />,
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
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => <Send color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <UserRound color={color} />,
          }}
        />
      </Tabs>
    </CheckAuth>
  );
}
