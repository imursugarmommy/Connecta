import React from "react";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Octicons
              name="home"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Suche",
          tabBarIcon: ({ color }) => (
            <Octicons
              name="search"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Octicons
              name="person"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
