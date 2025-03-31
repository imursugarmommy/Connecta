import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../helpers/AuthContext";

import { router } from "expo-router";
import AuthForm from "../../components/AuthForm";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const { login, authState } = useAuth();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).required("Username is required"),
    password: Yup.string().min(3).required("Password is required"),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage("");

    try {
      const loginResponse = await axios.post(
        `http://${serverip}:6969/users/login`,
        data
      );

      if (loginResponse.data.error)
        return setErrorMessage(loginResponse.data.error);

      const userResponse = await axios.get(
        `http://${serverip}:6969/users/${data.username}`
      );

      if (userResponse.data.error)
        return setErrorMessage(userResponse.data.error);

      await AsyncStorage.setItem("accessToken", loginResponse.data);
      await AsyncStorage.setItem(
        "profileImage",
        userResponse.data[0].profileImage || ""
      );

      const userData = userResponse.data[0];

      login({
        ...authState,
        id: userData.id,
        profileImage: userData.profileImage || "",
        email: userData.email,
        username: data.username,
        state: true,
      });

      setErrorMessage("");

      router.push("/");
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const checkForUsername = (username: string, name: string) => {
    setErrorMessage(`Checking ${name} ...`);

    setTimeout(() => {
      axios.get(`http://${serverip}:6969/users/${username}`).then((res) => {
        if (res.data.error) return setErrorMessage("Username does not exist");

        setErrorMessage("");
      });
    }, 500);
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-white w-full justify-start mb-6">
        Sign in
      </Text>

      <AuthForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        value={"Sign in"}
        errorMessage={errorMessage}
        checkForUsername={checkForUsername}
      />

      <View className="flex-row justify-center mt-4">
        <Text className="text-text-light dark:text-white mr-2">
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text className="text-blue-500">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default login;
