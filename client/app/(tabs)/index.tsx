import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center">
      <View
        className="h-3"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text className="text-2xl font-bold">Neue Posts für dich</Text>
      <View
        className="my-8 h-px w-4/5"
        lightColor="#eee"
        darkColor="rgb(255, 255, 255)"
      />
    </View>
  );
}
