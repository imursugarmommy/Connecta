import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../helpers/AuthContext";

import { router } from "expo-router";
import AuthForm from "../../components/AuthForm";

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
        "http://192.168.178.170:6969/users/login",
        data
      );

      if (loginResponse.data.error)
        return setErrorMessage(loginResponse.data.error);

      const userResponse = await axios.get(
        `http://192.168.178.170:6969/users/${data.username}`
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
      axios.get("http://192.168.178.170:6969/users/" + username).then((res) => {
        if (res.data) return setErrorMessage("Username already exists");

        setErrorMessage("");
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
        value={"Register"}
        errorMessage={errorMessage}
        checkForUsername={checkForUsername}
      />
    </View>
  );
};

export default login;
