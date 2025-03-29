import React, { useState, useRef } from "react";
import {Appearance} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";

const colorScheme = Appearance.getColorScheme();

const TabSwitcher = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    Animated.timing(animatedValue, {
      toValue: tab === "Posts" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTabWidth(width / 2);
  };

  return (
    <View onLayout={handleLayout}>
      <View className="flex-row bg-gray-100 dark:bg-black rounded-lg">
        <Animated.View
          className="absolute h-full bg-white dark:bg-black rounded-lg border border-gray-200"
          style={[{ transform: [{ translateX }], width: tabWidth }]}
        />
        <TouchableOpacity
          className="flex-1 py-2 justify-center items-center"
          onPress={() => handleTabPress("Posts")}>
          <Text
            style={[styles.text, activeTab === "Posts" && styles.activeText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-2 justify-center items-center"
          onPress={() => handleTabPress("Likes")}>
          <Text
            style={[styles.text, activeTab === "Likes" && styles.activeText]}>
            Likes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: colorScheme === "dark" ? "#e5e7eb" : "#000",
  },
  activeText: {
    color: colorScheme === "dark" ? "#FFD343" : "#FFD343",
    fontWeight: "bold",
  },
});

export default TabSwitcher;
