import React, { useCallback, useRef, useState } from "react";
import { router, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import CheckAuth from "../helpers/CheckAuth";
import PageHeader from "@/components/ui/PageHeader";

import { Home, Search, Plus, Send, UserRound } from "lucide-react-native";
import Headers from "@/components/ui/Headers";
import BottomSheet from "@gorhom/bottom-sheet";
import { useAuth } from "../helpers/AuthContext";
import BottomSheetComponent from "@/components/ui/BottomSheetComponent";
import LoginReminder from "@/components/ui/LoginReminder";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authState } = useAuth();

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  const snapPoints = ["40%"];

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isOpen ? "rgba(0,0,0,0.2)" : "transparent",
      opacity: opacity.value,
    };
  });

  return (
    <CheckAuth>
      <Animated.View
        className="absolute top-0 left-0 w-full h-full z-10"
        style={animatedStyle}
        pointerEvents={isOpen ? "auto" : "none"}
      />

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
            header: PageHeader,
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Suche",
            headerShown: false,
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

              if (!authState.state) return handleSnapPress(0);

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
          listeners={{
            tabPress: (e) => {
              if (!authState.state) {
                e.preventDefault();
                handleSnapPress(0);
                return;
              }
            },
          }}
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
          listeners={{
            tabPress: (e) => {
              if (!authState.state) {
                e.preventDefault();
                handleSnapPress(0);
                return;
              }
            },
          }}
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

      {isOpen && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={snapPoints}
          isOpen={isOpen}
          setIsOpen={setIsOpen}>
          <LoginReminder />
        </BottomSheetComponent>
      )}
    </CheckAuth>
  );
}
