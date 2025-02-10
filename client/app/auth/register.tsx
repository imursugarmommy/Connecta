import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";

import { router } from "expo-router";

import { useAuth } from "../helpers/AuthContext";
import AuthForm from "../../components/AuthForm";
import AsyncStorage from "@react-native-async-storage/async-storage";

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

const login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login, authState } = useAuth();

  const initialValues = {
    email: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().min(3).required("Name is required"),
    username: Yup.string().min(3).required("Username is required"),
    password: Yup.string().min(3).required("Password is required"),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage("");

    checkForUsername(data.username, "username and password");

    try {
      const createUserResponse = await axios.post(
        `http://${serverip}:6969/users/`,
        data
      );

      if (createUserResponse.data.error)
        return setErrorMessage(createUserResponse.data.error);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const loginResponse = await axios.post(
        `http://${serverip}:6969/users/login`,
        data
      );

      if (loginResponse.data.error)
        return setErrorMessage(loginResponse.data.error);

      await AsyncStorage.setItem("accessToken", loginResponse.data);

      login({
        ...authState,
        email: data.email,
        username: data.username,
        state: true,
      });

      setErrorMessage("");
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const checkForUsername = (username: string, name: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    setErrorMessage(`Checking ${name} ...`);

    setTimeout(() => {
      if (name === "Email" && !emailPattern.test(username))
        return setErrorMessage("Email is not valid");

      axios.get(`http://${serverip}:6969/users/${username}`).then((res) => {
        if (res.data.error) return setErrorMessage("");

        setErrorMessage(`${name} already exists`);
      });
    }, 500);
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-text-dark w-full justify-start mb-6">
        Register
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
