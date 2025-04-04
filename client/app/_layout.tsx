import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/components/useColorScheme";

import AuthProvider from "./helpers/AuthContext";
import PostProvider from "./helpers/PostContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PostProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modals/modal"
                options={{
                  presentation: "modal",
                  headerTitle: "Create Post",
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="post/[id]"
                options={{
                  title: "Post Overview",
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="chat/[id]"
                options={{
                  headerShown: false,
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
              <Stack.Screen
                name="user/[id]"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="menu"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="auth/login"
                options={{
                  headerTitle: "Login",
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  headerTitle: "Register",
                  headerBackTitle: "Back",
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
