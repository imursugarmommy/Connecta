import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

import { useAuth } from "../helpers/AuthContext";

export default function TabOneScreen() {
  const { authState } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Tab One</Text>

      <Text>{JSON.stringify(authState, null, 2)}</Text>

      <Link
        href="/auth/login"
        className="text-blue-500 my-4">
        Sign in
      </Link>
      <Link
        href="/auth/register"
        className="text-blue-500 my-4">
        Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
