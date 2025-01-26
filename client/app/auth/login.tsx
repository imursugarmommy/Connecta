import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../helpers/AuthContext";

import { router } from "expo-router";
import AuthForm from "../../components/AuthForm";

const buildServerIp = (ip: string, port: number) => {
  return `http://${ip}:${port}`;
};

const serverip = buildServerIp(String(process.env.EXPO_PUBLIC_SERVERIP), 6969);

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
      const loginResponse = await axios.post(serverip + "/users/login", data);

      console.log("login response: ", loginResponse.data);

      if (loginResponse.data.error)
        return setErrorMessage(loginResponse.data.error);

      const userResponse = await axios.get(
        serverip + `/users/byUsername/${data.username}`
      );

      if (userResponse.data.error)
        return setErrorMessage(userResponse.data.error);

      await AsyncStorage.setItem("accessToken", loginResponse.data);

      login({
        ...authState,
        id: userResponse.data.id,
        email: userResponse.data.email,
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

  const checkForUsername = (username: string) => {
    setErrorMessage("Loading...");

    setTimeout(() => {
      axios.get(serverip + "/users/" + username).then((res) => {
        if (res.data) return setErrorMessage("");

        setErrorMessage("Username does not exist");
      });
    }, 500);
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-text-dark w-full justify-start mb-6">
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
    </View>
  );
};

export default login;
